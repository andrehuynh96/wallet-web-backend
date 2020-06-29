const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const cache = redis.client();
module.exports = {
  getPrice: async ({ platform_name, currency }) => {
    try {
      logger.info('getPrice: getPrice');
      const key = platform_name + '_' + currency;
      let price = await cache.getAsync(key);
      if (price === null) {
        const coinGeckoClient = new CoinGecko();
        const coinPrices = await coinGeckoClient.simple.price({
          ids: [Platform[platform_name].name],
          vs_currencies: [currency]
        });
        price = coinPrices.data[Platform[platform_name].name.toLowerCase()][currency];
        //10p
        //await cache.setAsync(key, price, "EX", 600);
      }
      return price;
    }
    catch (err) {
      logger.info('coinGeckoClient.simple.price no found data with currency' + platform_name);
      throw err;
    }
  }
}