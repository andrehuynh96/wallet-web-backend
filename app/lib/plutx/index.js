const config = require('app/config');
const Axios = require('axios');
const logger = require("app/lib/logger");

module.exports = {
  registerDomain: async (data) => {
    try {
      let params = { ...data, headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest('/register-domain', params, 'post');
    } catch (err) {
      throw err;
    }
  },
  sendRawTransaction: async (data) => {
    try {
      let params = { ...data, headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest('/send-raw-transaction', params, 'post');
    } catch (err) {
      throw err;
    }
  },
  lookup: async (data) => {
    try {
      let params = { ...data };
      return await _makeGetRequest('/lookup', params, 'get');
    } catch (err) {
      throw err;
    }
  },
  getAddress: async (data) => {
    try {
      let params = { ...data };
      return await _makeGetRequest('/get-address', params, 'get');
    } catch (err) {
      throw err;
    }
  },
  saveMetadata: async (data) => {
    try {
      let params = { ...data, headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest('/save-metadata', params, 'post');
    } catch (err) {
      throw err;
    }
  },
};

async function _makeRequest(path, params, method) {
  try {
    let data = params ? params.body || {} : params;
    let headers = { ...params.headers };
    let url = path ? config.plutx.url + path : config.plutx.url;
    let options = {
      method: method,
      url: url,
      data: data,
      headers: headers,
    };
    let res = await Axios(options).catch(e => {
      throw e;
    });
    if (res.data.error) {
      return { error: res.data.error };
    } else {
      return { data: res.data };
    }
  } catch (err) {
    logger.error(err);
    return { error: err };
  }
}

async function _makeGetRequest(path, params, method) {
  try {
    let headers = { ...params.headers };
    let url = path ? config.plutx.url + path : config.plutx.url;
    let options = {
      method: method,
      url: url,
      params: params,
      headers: headers,
    };
    let res = await Axios(options).catch(e => {
      throw e;
    });
    if (res.data.error) {
      return { error: res.data.error };
    } else {
      return { data: res.data.result };
    }
  } catch (err) {
    logger.error(err);
    return { error: err };
  }
}
