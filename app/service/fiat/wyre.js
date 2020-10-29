const config = require('app/config');
const logger = require('app/lib/logger');
const crypto = require('crypto');
const axios = require('axios');
const { toSnakeCase } = require('app/lib/case-style');
const Fiat = require("./base");

class Wyre extends Fiat {
  constructor() {
    super();
  }

  async getCurrencies(options) {
    throw new Error(`You have not implemented getCurrencies function yet`);
  }

  async getCryptoCurrencies(options) {
    throw new Error(`You have not implemented getCryptoCurrencies function yet`);
  }

  async getCountries(options) {
    throw new Error(`You have not implemented getCountries function yet`);
  }

  async estimate({ source_currency, dest_currency, amount, dest_address,  country }) {
    try {
      const timestamp = new Date().getTime();
      const path = `/v3/orders/quote/partner?timestamp=${timestamp}`;
      const params = {
          amount: amount,
          sourceCurrency: source_currency,
          destCurrency: dest_currency,
          dest: dest_address,
          accountId: config.fiat.wyre.accountId,
          country: country
      }
      const method = "POST";
      return await this._makeRequest({path, method, params})
    }
    catch (err) {
      logger.error(`Wyre estimate error:`, err);
      throw err;
    }
  }

  async makeTransaction({ source_currency, dest_currency, amount, dest_address,  country }) {
    try {
      const timestamp = new Date().getTime();
      const path = `/v3/orders/reserve?timestamp=${timestamp}`;
      const method = "POST";
      let params = {
        amount: amount,
        sourceCurrency: source_currency,
        destCurrency: dest_currency,
        dest: dest_address,
        referrerAccountId: config.fiat.wyre.accountId,
        country: country  
      }
      return await this._makeRequest({path, method, params})
    }
    catch (err) {
      logger.error(`changelly createTransaction error:`, err);
      throw err;
    }
  }

  async getTransaction(transferId) {
    try {
      const path = `/v2/transfer/${transferId}/track`;
      let response = await axios.get(config.fiat.wyre.url + path);
      return response.data;
    }
    catch (err) {
      logger.error(`changelly getStatus error:`, err);
      throw err;
    }
  }

  async _makeRequest({ path, method, params }) {
    const details = JSON.stringify(params);
    const headers = {};
    const url = config.fiat.wyre.url + path;
    headers['Content-Type'] = 'application/json';
    headers['X-Api-Key'] = config.fiat.wyre.apiKey;
    headers['X-Api-Signature'] = this._signature(url, details);
    const config = {
        method: method,
        url: url,
        headers: headers,
        data: details
    }
    const response = await axios(config);
    if (response.data.error) {
      logger.error(`Wyre service error:`, response.data.error);
    }
    return toSnakeCase(response.data);
  }

  _signature(url, data){
    const dataToSign = url + data;
    const token = Crypto.enc.Hex.stringify(Crypto.HmacSHA256(dataToSign.toString(Crypto.enc.Utf8), config.fiat.wyre.secretKey));
    return token;
  }

}

module.exports = Wyre;