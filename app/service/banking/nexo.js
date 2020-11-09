const format = require("string-template")
const config = require('app/config')
const Banking = require("./base");
const InfinitoApi = require('node-infinito-api');
const { Http, TokenProvider } = require('node-infinito-util');
const NexoIBP = require("./nexo.ibp.json");
const { toSnakeCase } = require('app/lib/case-style');
const axios = require('axios');
const logger = require('app/lib/logger');
const redis = require("app/lib/redis");
const cache = redis.client();
const CACHE_KEY = 'INFINITO_TOKEN';

class Nexo extends Banking {
  constructor({ ibp = true }) {
    super();
    this.ibp = ibp;

  }

  async createAccount({ first_name, last_name, email }) {
    try {
      return await this._makeRequest({
        path: "/v1/user",
        method: "POST",
        body: {
          firstName: first_name,
          lastName: last_name,
          email: email
        }
      })
    }
    catch (err) {
      logger.error(`nexo createAccount error:`, err);
      throw err;
    }
  }

  async verifyEmail({ nexo_id, secret, code }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/${nexo_id}/verify/email`,
        method: "POST",
        body: {
          code: code
        },
        secret: secret
      })
    }
    catch (err) {
      logger.error(`nexo verifyEmail error:`, err);
      throw err;
    }
  }

  async requestRecoveryCode({ email }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/recovery/request`,
        method: "POST",
        body: {
          email: email
        }
      })
    }
    catch (err) {
      logger.error(`nexo requestRecoveryCode error:`, err);
      throw err;
    }
  }

  /**
   * @param  {} {email
   * @param  {} code}
   * @returns {id,secret}
   */
  async verifyRecoveryCode({ email, code }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/recovery/verify`,
        method: "POST",
        body: {
          email: email,
          code: code
        }
      })
    }
    catch (err) {
      logger.error(`nexo verifyRecoveryCode error:`, err);
      throw err;
    }
  }

  async getBalance({ nexo_id, secret }) {
    try {
      let result = await this._makeRequest({
        path: `/v1/user/${nexo_id}/balance`,
        method: "GET",
        secret: secret
      });

      return result.balances;
    }
    catch (err) {
      logger.error(`nexo getBalance error:`, err);
      throw err;
    }
  }

  async getDepositAddress({ nexo_id, currency_id, secret }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/${nexo_id}/deposit/${currency_id}/wallet`,
        method: "GET",
        secret: secret
      })
    }
    catch (err) {
      logger.error(`nexo getDepositAddress error:`, err);
      throw err;
    }
  }

  async withdraw({ nexo_id, amount, currency_id, wallet_address, tag, secret }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/${nexo_id}/withdraw`,
        method: "POST",
        body: {
          amount,
          currency_id,
          wallet_address,
          tag
        },
        secret: secret
      })
    }
    catch (err) {
      logger.error(`nexo withdraw error:`, err);
      throw err;
    }
  }

  async verifyWithdraw({ nexo_id, code, secret }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/${nexo_id}/verify/withdraw`,
        method: "POST",
        body: {
          code,
        },
        secret: secret
      })
    }
    catch (err) {
      logger.error(`nexo verifyWithdraw error:`, err);
      throw err;
    }
  }

  async getWithdrawTransactions({ nexo_id, code, secret }) {
    try {
      return await this._makeRequest({
        path: `/v1/user/${nexo_id}/transactions/withdraw`,
        method: "GET",
        secret: secret
      })
    }
    catch (err) {
      logger.error(`nexo getWithdrawTransactions error:`, err);
      throw err;
    }
  }

  async _makeRequest({ path, method, body, secret = null, ibp_options }) {
    let response;
    if (this.ibp) {
      response = await this._makeRequestThroughIBP({
        path, method, params: body, secret
      })
    }
    else {
      response = await this._makeRequestThroughNexo({
        path, method, params: body, secret
      })
    }
    return toSnakeCase(response);
  }

  async _makeRequestThroughNexo({ path, method, params, secret = null }) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Key': config.banking.nexo.apiKey
    };
    if (secret) {
      headers['X-Auth-User-Secret'] = secret;
    }

    const options = {
      method: method,
      url: config.banking.nexo.url + path,
      headers: headers,
      data: params
    }
    const response = await axios(options);
    if (response.data.error) {
      logger.error(`Nexo service error:`, response.data.error);
      throw response.data.error;
    }

    return response.data;
  }

  async _makeRequestThroughIBP({ path, method, params, secret = null }) {
    let token = await _getIbpToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    if (secret) {
      headers['X-Auth-User-Secret'] = secret;
    }
    if (method.toUpperCase() == "POST") {
      let time = Date.now();
      let checksum = _getChecksumIbp(method, `/nexo${path}`, params, time);
      headers['x-time'] = time;
      headers['x-checksum'] = checksum;
    }

    const options = {
      method: method,
      url: `${config.sdk.baseUrl}/nexo${path}`,
      headers: headers,
      data: params
    }
    const response = await axios(options);
    if (response.data.error) {
      logger.error(`IBP service error: `, response.data.error);
      throw response.data.error;
    }

    return response.data.data;
  }

  _setHeaderIBP(secret) {
    Http.send = async (url, method = 'GET', headers, data) => {
      if (!headers) {
        headers = {};
      }
      headers["X-Auth-User-Secret"] = secret;
      return await axios({
        url,
        method: method,
        headers: headers,
        data: data || {},
      });
    }
  }
}

async function _getIbpToken() {
  if (cache) {
    let token = await cache.getAsync(CACHE_KEY);
    if (token) {
      return token;
    }
  }

  const opts = {
    apiKey: config.sdk.apiKey,
    secret: config.sdk.secretKey,
    url: `${config.sdk.baseUrl}/iam/token`
  };
  let tokenProvider = new TokenProvider(opts);
  token = await tokenProvider.getLatestToken();
  if (cache) {
    await cache.setAsync(CACHE_KEY, token, "EX", 60 * 60);
  }
  return token;
}

function _getChecksumIbp(method, url, body, time) {
  const opts = {
    apiKey: config.sdk.apiKey,
    secret: config.sdk.secretKey,
    url: `${config.sdk.baseUrl}/iam/token`
  };
  let tokenProvider = new TokenProvider(opts);
  return tokenProvider.getChecksum({
    secretKey: config.sdk.secretKey,
    httpVerb: method,
    url: url,
    jsonEncodeBody: JSON.stringify(body),
    xTime: time
  })
}

module.exports = Nexo;