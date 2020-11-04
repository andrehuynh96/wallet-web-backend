const config = require('app/config');
const logger = require('app/lib/logger');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const { toSnakeCase } = require('app/lib/case-style');
const FiatCryptoCurrency = require('app/model/wallet').fiat_cryptocurrencies;
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

  async estimate({ sourceCurrency, destCurrency, amount, destAddress, country }) {
    try {
      const timestamp = new Date().getTime();
      const path = `/v3/orders/quote/partner?timestamp=${timestamp}`;
      let currency = await FiatCryptoCurrency.findOne({
        where: {
          symbol: destCurrency.toUpperCase()
        }
      })
      let dest = destAddress;
      if (currency) {
        if (currency.symbol == currency.platform) {
          dest = currency.name.toLowerCase() + ":" + destAddress;
        } else {
          let crypto = await FiatCryptoCurrency.findOne({
            where: {
              symbol: currency.platform
            }
          })
          if (crypto) {
            dest = crypto.name.toLowerCase() + ":" + destAddress;
          }
        }
      }  
      const params = {
          amount: amount,
          sourceCurrency: sourceCurrency,
          destCurrency: destCurrency,
          dest: dest,
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

  async makeTransaction({ sourceCurrency, destCurrency, amount, destAddress, paymentMethod, redirectUrl, failureRedirectUrl, country, email, phone, firstName, lastName, postalCode, city, address }) {
    try {
      const timestamp = new Date().getTime();
      const path = `/v3/orders/reserve?timestamp=${timestamp}`;
      const method = "POST";
      let currency = await FiatCryptoCurrency.findOne({
        where: {
          symbol: destCurrency.toUpperCase()
        }
      })
      let dest = destAddress;
      if (currency) {
        if (currency.symbol == currency.platform) {
          dest = currency.name.toLowerCase() + ":" + destAddress;
        } else {
          let crypto = await FiatCryptoCurrency.findOne({
            where: {
              symbol: currency.platform
            }
          })
          if (crypto) {
            dest = crypto.name.toLowerCase() + ":" + destAddress;
          }
        }
      }
      let params = {
        amount: amount,
        sourceCurrency: sourceCurrency,
        destCurrency: destCurrency,
        dest: dest,
        referrerAccountId: config.fiat.wyre.accountId,
        paymentMethod: paymentMethod.toLowerCase(),
        redirectUrl: redirectUrl,
        failureRedirectUrl: failureRedirectUrl,
        country: country,
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        postalCode: postalCode,
        city: city,
        street1: address,
        lockFields: ['amount', 'sourceCurrency', 'destCurrency', 'dest']
      }
      return await this._makeRequest({path, method, params})
    }
    catch (err) {
      logger.error(`Wyre make transaction error:`, err);
      throw err;
    }
  }

  async getTransaction({transferId}) {
    try {
      const path = `/v2/transfer/${transferId}/track`;
      let response = await axios.get(config.fiat.wyre.url + path);
      return response.data;
    }
    catch (err) {
      logger.error(`Wyre get transaction error:`, err);
      throw err;
    }
  }

  async getOrder ({orderId}) {
    try {
      const path = `/v3/orders/${orderId}`;
      let response = await axios.get(config.fiat.wyre.url + path);
      return response.data;
    }
    catch (err) {
      console.error(`Wyre get order error:`, err);
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
    const options = {
        method: method,
        url: url,
        headers: headers,
        data: details
    }
    const response = await axios(options);
    if (response.data.error) {
      logger.error(`Wyre service error:`, response.data.error);
    }
    return toSnakeCase(response.data);
  }

  _signature(url, data){
    const dataToSign = url + data;
    const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), config.fiat.wyre.secretKey));
    return token;
  }

}

module.exports = Wyre;