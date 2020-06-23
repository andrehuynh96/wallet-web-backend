const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');
var requestIp = require('request-ip');
module.exports = {
    getCountryLocal: async (req) => {
        try {
            const _ip = _getIpClient(req);
            return await Axios.get(`https://freegeoip.app/json/${_ip}`);
        }catch (err) {
            logger.error("getCountryLocal: ", err);
            throw err;
        }
    },
    isAllowCountryLocal: async (req) => {
        try {
            const _ip = _getIpClient(req);
            logger.info('isAllowCountryLocal', req);
            logger.info('isAllowCountryLocal _ip :' + _ip)
            const _country = await Axios.get(`https://freegeoip.app/json/${_ip}`);
            const _CountryWhitelist = config.membership.countryWhitelist.split(',')
            return _CountryWhitelist.indexOf(_country.data.country_code) > -1;
        }catch (err) {
            logger.error("isExistCountryLocal: ", err);
            throw err;
        }
    }
}

function _getIpClient(req){
        return requestIp.getClientIp(req); // on localhost > 127.0.0.1
}