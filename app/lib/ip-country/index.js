const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');

module.exports = {
  getCountryLocal: async (req) => {
    try {
      const ip = _getIpClient(req);
      let key = config.apiKeyIP;
      let result;
      if (key) {
        result = await Axios.get(`http://pro.ip-api.com/json/${ip}?key=${key}`);
      }
      else {
        result = await Axios.get(`http://ip-api.com/json/${ip}`);
      }
      const data = {
        data: result.data,
        headers: req.headers
      }
      return data;
    } catch (err) {
      logger.error("getCountryLocal: ", err);
      throw err;
    }
  },
  isAllowCountryLocal: async (req) => {
    try {
      const ip = _getIpClient(req);
      let key = config.apiKeyIP;
      let result;
      if (key) {
        result = await Axios.get(`http://pro.ip-api.com/json/${ip}?key=${key}`);
      }
      else {
        result = await Axios.get(`http://ip-api.com/json/${ip}`);
      }
      const countryWhitelist = config.membership.countryWhitelist.split(',')
      return countryWhitelist.indexOf(result.data.countryCode) > -1;
    } catch (err) {
      logger.error("isExistCountryLocal: ", err);
    }
    return false;
  }
}

function _getIpClient(req) {
  const registerIp = (req.headers['x-forwarded-for'] || req.headers['x-client-ip'] || req.ip);
  let ips = registerIp.split(",");
  if (ips.length > 0) {
    return ips[0].trimStart().trimEnd();
  }

  return "";
}