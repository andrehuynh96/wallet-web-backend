const logger = require('app/lib/logger');
const config = require("app/config");
const Axios = require('axios');

module.exports = {
  getPrice: async (platform) => {
    try {
      let result = await Axios.get(`${config.mxcAPI}/v2/market/ticker?symbol=${platform.toUpperCase()}_USDT`);
      result = result.data.data[0];
      return {
        price: parseFloat(result.last),
        usd_24h_change: parseFloat(result.last) - parseFloat(result.open)
      };
    }
    catch (err) {
      logger.info('mxc get price no found data with currency' + platform);
      throw err;
    }
  },
} 