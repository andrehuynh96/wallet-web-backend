const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');
var requestIp = require('request-ip');
module.exports = {
  getCountryLocal: async (req) => {
    try {
      const _ip = _getIpClient(req);
      const result = await Axios.get(`https://freegeoip.app/json/${_ip}`);
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
      const _ip = _getIpClient(req);
      const _country = await Axios.get(`https://freegeoip.app/json/${_ip}`);
      const _CountryWhitelist = config.membership.countryWhitelist.split(',')
      return _CountryWhitelist.indexOf(_country.data.country_code) > -1;
    } catch (err) {
      logger.error("isExistCountryLocal: ", err);
    }
    return false;
  }
}

function _getIpClient(req) {
  const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
  let ips = registerIp.split(",");
  if (ips.length > 0) {
    return ips[0].trimStart().trimEnd();
  }

  return "";
}