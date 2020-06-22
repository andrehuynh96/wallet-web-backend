const logger = require('app/lib/logger');
const Axios = require('axios');
const config = require('app/config');
module.exports = {
    getCountryLocal: async () => {
        try {
            return await Axios.get('http://ip-api.com/json')
        }catch (err) {
            logger.error("getCountryLocal: ", err);
            throw err;
        }
    },
    isAllowCountryLocal: async () => {
        try {
            const _country = await Axios.get('http://ip-api.com/json');
            const _CountryWhitelist = config.membership.countryWhitelist.split(',')
            return _CountryWhitelist.indexOf(_country.data.countryCode) > -1;
        }catch (err) {
            logger.error("isExistCountryLocal: ", err);
            throw err;
        }
    }
}