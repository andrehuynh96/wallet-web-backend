const config = require('app/config');
const Axios = require('axios');
const logger = require("app/lib/logger");
const FormData = require('form-data');
const MediaType = require('app/model/wallet/value-object/media-type');

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
  getKycForMember: async ({ kyc_id, kyc_status }) => {
    try {
      const option = {
        path: `/api/kycs/me/customers/${kyc_id}`,
        data: {},
        method: 'get',
        content_type: MediaType.APPLICATION_JSON_VALUE
      }
      const result = await _executeRequest(option);
      const kyc = result && result.data ? result.data.customer.kyc : null;
      let kyc_level = 0;
      if (kyc) {
        let length = Object.keys(kyc).length;
        let level = 0;
        for (let i = 1; i <= length; i++) {
          if (kyc[i.toString()].status == kyc_status) {
            kyc_level++;
          }else{
			  break;
		  }
        }
      }
      const _resData = {
        kycs: kyc,
        current_kyc_level: kyc_level
      }
      return { httpCode: 200, data: _resData };
    } catch (err) {

      logger.error("get request KYC fail:", err);
      let data = {};
      if(err.response.status == 404){
        data.message = 'Request system Kyc get KycForMember fail';
      } else {
        data = err.response.data;
      }
      return { httpCode: err.response.status, data: data };
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

async function _executeRequest({ path, data, method, content_type }) {

  let xuser = { kycName: config.kyc.name };
  let headers = { 'Content-Type': content_type, 'x-user': JSON.stringify(xuser) };
  let url = path ? config.kyc.baseUrl + path : config.kyc.baseUrl;
  let options = {
    method: method,
    url: url,
    data: data,
    headers: headers,
  };

  const result = await Axios(options);
  return result.data;
}