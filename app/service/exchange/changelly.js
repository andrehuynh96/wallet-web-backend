const config = require('app/config');
const logger = require('app/lib/logger');
const crypto = require('crypto');
const axios = require('axios');
const { toSnakeCase } = require('app/lib/case-style');
const Exchange = require("./base");

const mappingCoin = {
  "USDT": "USDT20"
}

class Changelly extends Exchange {
  constructor() {
    super();
  }

  async getCurrencies(options) {
    try {
      return await this._makeRequest({
        method: 'getCurrenciesFull',
        params: {}
      })
    }
    catch (err) {
      logger.error(`changelly getCurrencies error:`, err);
      throw err;
    }
  }

  async getMinAmount({ from, to, fix_rate = false }) {
    try {
      return await this._makeRequest({
        method: 'getPairsParams',
        params: {
          from: _getPlatform(from.toUpperCase()),
          to: _getPlatform(to.toUpperCase())
        }
      })
    }
    catch (err) {
      logger.error(`changelly getMinAmount error:`, err);
      throw err;
    }
  }

  async estimate({ from, to, amount, fix_rate = false }) {
    try {
      if (!fix_rate) {
        return await this._estimate({ from, to, amount });
      }
      return await this._estimateFixRate({ from, to, amount });
    }
    catch (err) {
      logger.error(`changelly getExchangeAmount error:`, err);
      throw err;
    }
  }

  async makeTransaction({ from, to, amount, address, extra_id, refund_address, refund_extra_id, rate_id, amount_to }) {
    try {
      if (rate_id) {
        return await this._makeTransactionFixRate({ from, to, amount, address, extra_id, refund_address, refund_extra_id, rate_id, amount_to });
      }
      return await this._makeTransaction({ from, to, amount, address, extra_id, refund_address, refund_extra_id });
    }
    catch (err) {
      logger.error(`changelly createTransaction error:`, err);
      throw err;
    }
  }

  async getTransaction(options) {

  }

  async getStatus(options) {

  }

  async _estimate({ from, to, amount }) {
    return await this._makeRequest({
      method: 'getExchangeAmount',
      params: [{
        from: _getPlatform(from.toUpperCase()),
        to: _getPlatform(to.toUpperCase()),
        amount: amount
      }]
    })
  }

  async _estimateFixRate({ from, to, amount }) {
    return await this._makeRequest({
      method: 'getFixRate',
      params: [{
        from: _getPlatform(from.toUpperCase()),
        to: _getPlatform(to.toUpperCase()),
        // amountFrom: amount
      }]
    })
  }
  async _makeTransaction({ from, to, amount, address, extra_id, refund_address, refund_extra_id }) {
    return await this._makeRequest({
      method: 'createTransaction',
      params: {
        from: _getPlatform(from.toUpperCase()),
        to: _getPlatform(to.toUpperCase()),
        amount: amount,
        address: address,
        extraId: extra_id,
        refundAddress: refund_address,
        refundExtraId: refund_extra_id
      }
    })
  }

  async _makeTransactionFixRate({ from, to, amount, address, extra_id, refund_address, refund_extra_id, rate_id, amount_to }) {
    return await this._makeRequest({
      method: 'createFixTransaction',
      params: {
        from: _getPlatform(from.toUpperCase()),
        to: _getPlatform(to.toUpperCase()),
        amountFrom: amount,
        address: address,
        extraId: extra_id,
        refundAddress: refund_address,
        refundExtraId: refund_extra_id,
        rateId: rate_id,
        // amountTo: amount_to
      }
    })
  }

  async _makeRequest({ method, params }) {
    let data = {
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: this._id()
    };

    let options = {
      method: 'post',
      url: config.exchange.changelly.url,
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.exchange.changelly.apiKey,
        'sign': this._sign(data)
      },
      data: data
    };

    let response = await axios(options);
    if (response.data.error) {
      logger.error(`changelly service error:`, response.data.error);
    }
    return toSnakeCase(response.data);
  }

  _sign(message) {
    const sign = crypto
      .createHmac('sha512', config.exchange.changelly.secretKey)
      .update(JSON.stringify(message))
      .digest('hex');
    return sign;
  }

  _id() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

function _getPlatform(platform) {
  if (mappingCoin[platform]) {
    return mappingCoin[platform];
  }

  return platform;
}


module.exports = Changelly;