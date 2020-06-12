const config = require('app/config');
const Axios = require('axios');
const logger = require("app/lib/logger");
const FormData = require('form-data');

module.exports = {
  createAccount: async (data) => {
    try {
      let params = { ...data, headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest('/api/kycs/me/customers', params, 'post');
    } catch (err) {
      throw err;
    }
  },
  getKycInfo: async (data) => {
    try {
      let params = { headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest(`/api/kycs/me/customers/${data.kycId}`, params, 'get');
    } catch (err) {
      throw err;
    }
  },
  updateStatus: async (data) => {
    try {
      let params = { ...data, headers: { 'Content-Type': 'application/json' } }
      return await _makeRequest(`/api/kycs/me/customers/${data.kycId}/${data.action}`, params, 'put');
    } catch (err) {
      throw err;
    }
  },
  submit: async (data) => {
    try {
      var formData = new FormData();
      formData.append('information', JSON.stringify(data.body));
      let params = { body: formData, headers: formData.getHeaders() };
      return await _makeRequest(`/api/kycs/me/customers/${data.kycId}/submit`, params, 'post');
    } catch (err) {
      throw err;
    }
  },
  getSchema: async () => {
    try {
      let params = { headers: { 'Content-Type': 'application/json' } };
      return await _makeRequest(`/api/kycs/me/schemas`, params, 'get');
    } catch (err) {
      throw err;
    }
  },
};

async function _makeRequest(path, params, method) {
  try {
    let data = params ? params.body || {} : params;
    let xuser = { kycName: config.kyc.name };
    let headers = { ...params.headers, 'x-user': JSON.stringify(xuser) };
    let url = path ? config.kyc.baseUrl + path : config.kyc.baseUrl;
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
      return { data: res.data.data };
    }
  } catch (err) {
    logger.error(err);
    return { error: err };
  }
}
