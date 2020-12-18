const logger = require('app/lib/logger');
const FiatFactory = require('app/service/fiat/factory');
const FiatProvider = require('app/service/fiat/provider');
const Member = require('app/model/wallet').members;
const FiatTransaction = require('app/model/wallet').fiat_transactions;
const Mapper = require('app/feature/response-schema/fiat-transaction.response-schema');
const conf = require("app/config");
const FiatStatus = require("app/model/wallet/value-object/fiat-transaction-status");
const uuidV4 = require('uuid/v4');

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
      logger[err.canLogAxiosError ? 'error' : 'info']('estimate fail:', err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let transaction = await FiatTransaction.findOne({
        where: {
          order_id: req.body.order_id
        }
      });
      if (transaction)
        return res.ok({ success: false });
      let result = await Service.getOrder({ orderId: req.body.order_id });
      if (!result)
        return res.ok({ success: false });
      let data = {
        order_id: result.id,
        status: result.status,
        from_amount: result.sourceAmount,
        transaction_id: result.transferId,
        payment_method_name: result.paymentMethodName,
        order_type: result.orderType,
        member_id: req.user.id,
        from_currency: result.sourceCurrency,
        to_cryptocurrency: result.destCurrency,
        to_address: result.dest
      };
      if (result.transferId) {
        let transaction = await Service.getTransaction({ transferId: result.transferId });
        if (transaction) {
          data.tx_id = transaction.blockchainNetworkTx;
          data.rate = transaction.rate;
          data.to_amount = transaction.destAmount;
          data.fee_currency = transaction.feeCurrency;
          data.message = transaction.message;
          data.fees = transaction.fees;
          data.total_fee = transaction.fee;
          data.response = JSON.stringify(transaction);
        }
      }
      await FiatTransaction.create(data);
      return res.ok({
        success: true,
        status: result.status == FiatStatus.FAILED ? 0 : 1
      });
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('create fiat transaction fail:', err);
      next(err);
    }
  },

  make: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let urlSuccess = `${req.baseurl}/web/fiat/transactions/callback/${verifyToken}`;
      let urlFailure = `${req.baseurl}/web/fiat/transactions/callback/${verifyToken}`;
      let result = await Service.makeTransaction({
        amount: req.body.amount,
        sourceCurrency: req.body.source_currency,
        destCurrency: req.body.dest_currency,
        destAddress: req.body.dest_address,
        paymentMethod: req.body.payment_method,
        failureRedirectUrl: urlFailure,// req.body.failure_redirect_url,
        redirectUrl: urlSuccess,//req.body.redirect_url,
        email: member.email,
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

      await FiatTransaction.create({
        token: verifyToken,
        member_id: req.user.id,
        from_currency: req.body.source_currency,
        to_cryptocurrency: req.body.dest_currency,
        from_amount: req.body.amount,
        to_address: req.body.dest_address,
        fe_redirect_url: req.body.redirect_url,
        fe_failure_redirect_url: req.body.failure_redirect_url,
        redirect_url: urlSuccess,
        failure_redirect_url: urlFailure,
        payment_url: result.url,
        fee_currency: ''
      });

      return res.ok(result);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('make fiat transaction fail:', err);
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let result = await Service.getOrder({ orderId: req.body.order_id });
      let data = {
        order_id: result.id,
        status: result.status,
        from_amount: result.sourceAmount,
        transaction_id: result.transferId,
        payment_method_name: result.paymentMethodName,
        order_type: result.orderType
      };
      if (result.transferId) {
        let transaction = await Service.getTransaction({ transferId: result.transferId });
        if (transaction) {
          data.tx_id = transaction.blockchainNetworkTx;
          data.rate = transaction.rate;
          data.to_amount = transaction.destAmount;
          data.fee_currency = transaction.feeCurrency;
          data.message = transaction.message;
          data.fees = transaction.fees;
          data.total_fee = transaction.fee;
          data.response = JSON.stringify(transaction);
        }
      }
      await FiatTransaction.update(data, {
        where: {
          member_id: req.user.id,
          id: req.params.id
        }
      });
      return res.ok(true);
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('update fiat transaction fail:', err);
      next(err);
    }
  },

  getTxById: async (req, res, next) => {
    try {
      const where = { member_id: req.user.id, id: req.params.id };
      let transaction = await FiatTransaction.findOne({
        where: where
      });
      if (!transaction) {
        return res.badRequest(res.__("TRANSACTION_NOT_FOUND"), "TRANSACTION_NOT_FOUND", {
          fields: ['id'],
        });
      }
      else {
        return res.ok(Mapper(transaction));
      }
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get fiat transaction fail:', err);
      next(err);
    }
  },

  getTxs: async (req, res, next) => {
    try {
      let { query: { offset, limit, sort_field, sort_by }, user } = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(conf.appLimit);
      let field = sort_field || 'createdAt';
      field = (field == 'created_at' ? 'createdAt' : field);
      field = (field == 'updated_at' ? 'updatedAt' : field);
      const by = sort_by && (sort_by.toUpperCase() == 'DESC' || sort_by.toUpperCase() == 'ASC') ? sort_by.toUpperCase() : 'DESC';
      let { count: total, rows: transactions } = await FiatTransaction.findAndCountAll({
        where: where,
        limit: lim,
        offset: off,
        order: [[field, by]]
      });
      return res.ok({
        items: Mapper(transactions),
        offset: off,
        limit: lim,
        total: total
      });
    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get fiat transaction by user fail:', err);
      next(err);
    }
  },

  callback: async (req, res, next) => {
    try {
      let token = req.params.token;
      let orderid = req.query.orderId;

      let transaction = await FiatTransaction.findOne({
        where: {
          token: token
        }
      });
      if (!transaction) {
        return res.redirect(conf.webWallet.apiUrl);
      };

      let updateFail = async () => {
        await FiatTransaction.update({
          status: FiatStatus.FAILED
        },
          {
            where: {
              id: transaction.id
            }
          }
        )
      }

      if (!orderid) {
        await updateFail();
        return res.redirect(transaction.fe_failure_redirect_url);
      }
      const Service = FiatFactory.create(FiatProvider.Wyre, {});
      let result = await Service.getOrder({ orderId: orderid });
      if (!result) {
        await updateFail();
        return res.redirect(transaction.fe_failure_redirect_url);
      }
      let data = {
        order_id: result.id,
        status: result.status,
        from_amount: result.sourceAmount,
        transaction_id: result.transferId,
        payment_method_name: result.paymentMethodName,
        order_type: result.orderType,
        from_currency: result.sourceCurrency,
        to_cryptocurrency: result.destCurrency,
        to_address: result.dest
      };
      if (result.transferId) {
        let wyreTransaction = await Service.getTransaction({ transferId: result.transferId });
        if (wyreTransaction) {
          data.tx_id = wyreTransaction.blockchainNetworkTx;
          data.rate = wyreTransaction.rate;
          data.to_amount = wyreTransaction.destAmount;
          data.fee_currency = wyreTransaction.feeCurrency;
          data.message = wyreTransaction.message;
          data.fees = wyreTransaction.fees;
          data.total_fee = wyreTransaction.fee;
          data.response = JSON.stringify(wyreTransaction);
        }
      }
      await FiatTransaction.update(data, {
        where: {
          id: transaction.id
        }
      });
      let redurectUrl = (result.status == FiatStatus.FAILED ? transaction.fe_failure_redirect_url : `${transaction.fe_redirect_url}?orderId=${orderid}`);
      return res.redirect(redurectUrl);
    }
    catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('callback transaction wyre fail:', err);
      next(err);
    }
  },
};
