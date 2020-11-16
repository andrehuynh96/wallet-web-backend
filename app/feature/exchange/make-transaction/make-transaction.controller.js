const logger = require('app/lib/logger');
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');
const ExchangeTransaction = require('app/model/wallet').exchange_transactions;
const Mapper = require("app/feature/response-schema/exchange/transaction.response-schema");
const CoinGeckoPrice = require('app/lib/coin-gecko-client');

module.exports = async (req, res, next) => {
  try {
    const Service = ExchangeFactory.create(ExchangeProvider.Changelly, {});
    let result = await Service.makeTransaction({
      from: req.body.from_currency,
      to: req.body.to_currency,
      amount: req.body.amount,
      address: req.body.address,
      extra_id: req.body.extra_id || '',
      refund_address: req.body.refund_address || '',
      refund_extra_id: req.body.refund_extra_id || '',
      rate_id: req.body.rate_id || '',
      amount_to: req.body.amount_to || 0
    });

    if (result.error) {
      return res.badRequest(result.error.message, "EXCHANGE_PROVIDER_ERROR");
    }
    result = result.result;

    let estimateAmountUSD = await _getAmountUSD(req.body.from_currency.toUpperCase(), result.amount_expected_from);
    let response = await ExchangeTransaction.create({
      member_id: req.user.id,
      from_currency: req.body.from_currency.toUpperCase(),
      to_currency: req.body.to_currency.toUpperCase(),
      request_recipient_address: req.body.address,
      request_amount: req.body.request_amount,
      request_extra_id: req.body.extra_id,
      request_refund_address: req.body.refund_address,
      request_refund_extra_id: req.body.refund_extra_id,
      rate_id: req.body.rate_id,
      transaction_id: result.id,
      transaction_date: result.created_at,
      provider_fee: result.changelly_fee,
      api_extra_fee: result.api_extra_fee,
      payin_extra_id: result.payin_extra_id,
      payout_extra_id: result.payout_extra_id,
      status: result.status.toUpperCase(),
      amount_expected_from: result.amount_expected_from,
      amount_expected_to: result.amount_expected_to,
      amount_to: result.amount_to > 0 ? result.amount_to : result.amount_expected_to,
      payin_address: result.payin_address,
      payout_address: result.payout_address,
      response: JSON.stringify(result),
      estimate_amount_usd: estimateAmountUSD
    });
    return res.ok(Mapper(response));
  }
  catch (err) {
    logger.error('estimate fail:', err);
    next(err);
  }
}

async function _getAmountUSD(platform, amount) {
  try {
    const { price } = await CoinGeckoPrice.getPrice({ platform_name: platform, currency: 'usd' });
    return price * amount;
  }
  catch (err) {
    return 0;
  }
}