const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');
const publicIp = require('public-ip');
module.exports = {
    getCountryLocal: async () => {
        try {
            const _ip = await publicIp.v4();
            return await Axios.get(`https://freegeoip.app/json/${_ip}`);
        }catch (err) {
            logger.error("getCountryLocal: ", err);
            throw err;
        }
    },
    isAllowCountryLocal: async () => {
        try {
            const _ip = await publicIp.v4();
            const _country = await Axios.get(`https://freegeoip.app/json/${_ip}`);
            const _CountryWhitelist = config.membership.countryWhitelist.split(',')
            return _CountryWhitelist.indexOf(_country.data.country_code) > -1;
        }catch (err) {
            logger.error("isExistCountryLocal: ", err);
            throw err;
        }
    }
}