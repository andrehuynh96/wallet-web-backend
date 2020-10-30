const logger = require('app/lib/logger');
const FiatFactory = require('app/service/fiat/factory');
const FiatProvider = require('app/service/fiat/provider');
const Member = require('app/model/wallet').members;
const FiatTransaction = require('app/model/wallet').fiat_transactions;
module.exports = {
  estmate: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let result = await Service.estimate({
        sourceCurrency: req.body.source_currency,
        destCurrency: req.body.dest_currency,
        amount: req.body.amount,
        destAddress: req.body.dest_address,
        country: req.body.country.toUpperCase() || 'VN',
      });
      if (result.error) {
        return res.badRequest(result.error.message, "FIAT_PROVIDER_ERROR");
      }
      return res.ok(result);
    }
    catch (err) {
      logger.error('estimate fail:', err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      let result = await Service.makeTransaction({
        amount: req.body.amount,
        sourceCurrency: req.body.source_currency,
        destCurrency: req.body.dest_currency,
        destAddress: req.body.dest_address,
        paymentMethod: req.body.payment_method,
        failureRedirectUrl: req.body.failure_redirect_url,
        redirectUrl: req.body.redirect_url,
        email: member.email,
        country: member.country,
        phone: member.phone,
        firstName: member.first_name,
        lastName: member.last_name,
        postalCode: member.post_code,
        city: member.city,
        address: member.address
      });
      if (result.error) {
        return res.badRequest(result.error.message, "FIAT_PROVIDER_ERROR");
      }
      let data = {
        payment_url: result.url,
        reservation: result.reservation,
        member_id: req.user.id,
        from_currency: req.body.source_currency,
        to_cryptocurrency: req.body.dest_currency,
        to_address: req.body.dest_address,
        payment_method: req.body.payment_method,
        from_amount: req.body.amount,
        failure_redirect_url: req.body.failure_redirect_url,
        redirect_url: req.body.redirect_url
      }
      let transaction = await FiatTransaction.create(data);
      result.id = transaction.id 
      return res.ok(result);
    } catch (err) {
      logger.error('create fiat transaction fail:', err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let result = await Service.getOrder({orderId : req.body.order_id});
      let data = {
        order_id: result.id,
        status: result.status,
        from_amount: result.sourceAmount,
        transaction_id: result.transferId,
        payment_method_name: result.paymentMethodName,
        order_type: result.orderType
      }
      if (result.transferId) {
        let transaction = await Service.getTransaction({transferId: result.transferId});
        if (transaction) {
          data.tx_id = transaction.blockchainNetworkTx;
          data.rate = transaction.rate;
          data.to_amount = transaction.destAmount;
          data.fee_currency = transaction.feeCurrency;
          data.message = transaction.message;
          data.fees = transaction.fees;
          data.total_fee = transaction.fee;
          data.response = JSON.stringify(transaction)
        }
      } 
      await FiatTransaction.update(data, {
        where: {
          member_id: req.user.id,
          id: req.params.id
        }
      }) 
      return res.ok(true);
    } catch (err) {
      logger.error('update fiat transaction fail:', err);
      next(err);
    }
  }
}