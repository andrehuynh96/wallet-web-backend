const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');
var requestIp = require('request-ip');
module.exports = {
    getCountryLocal: async (req) => {
        try {
            const _ip = _getIpClient(req);
            logger.info('getCountryLocal', req.headers);
            logger.info('_ip', _ip)
            const result = await Axios.get(`https://freegeoip.app/json/${_ip}`);
            const data = {
                data: result.data,
                headers: req.headers
            }
            return data;
        }catch (err) {
            logger.error("getCountryLocal: ", err);
            throw err;
        }
    },
    isAllowCountryLocal: async (req) => {
        try {
            const _ip = _getIpClient(req);
            logger.info('getCountryLocal', req.headers);
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
    const xForwardedFor = req.headers['x-forwarded-for'];
    //the first ip is client Ip.
    return xForwardedFor.split(',')[0];
}