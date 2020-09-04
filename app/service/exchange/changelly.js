const config = require('app/config');
const logger = require('app/lib/logger');
const crypto = require('crypto');
const axios = require('axios');
const Exchange = require("./base");

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
    }
    return null;
  }

  async getMinAmount({ from, to }) {
    try {
      return await this._makeRequest({
        method: 'getMinAmount',
        params: {
          from: from.toLowerCase(),
          to: to.toLowerCase()
        }
      })
    }
    catch (err) {
      logger.error(`changelly getMinAmount error:`, err);
    }
    return null;
  }

  async estimate(options) {

  }

  async makeTransaction(options) {

  }

  async getTransaction(options) {

  }

  async getTransactionDetail(options) {

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
      throw response.data.error;
    }
    return response.data;
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

module.exports = Changelly;