const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const { StepFunctions } = require('aws-sdk');
const cache = redis.client();
const mappingCoin = {
  "BTCSW": "BTC"
}

module.exports = {
  getPrice: async ({ platform_name, currency }) => {
    try {
      if (platform_name == "USDT") {
        return 1;
      }
      platform_name = _getplatform(platform_name);
      logger.info('getPrice: getPrice');
      const key = platform_name + '_' + currency;
      let price = await cache.getAsync(key);
      if (price === null) {
        const coinGeckoClient = new CoinGecko();
        const coinPrices = await coinGeckoClient.simple.price({
          ids: [Platform[platform_name].coingeckoId],
          vs_currencies: [currency]
        });
        price = coinPrices.data[Platform[platform_name].coingeckoId.toLowerCase()][currency];
        //10p
        await cache.setAsync(key, price, "EX", 30);
      }
      return price;
    }
    catch (err) {
      logger.info('coinGeckoClient.simple.price no found data with currency' + platform_name);
      throw err;
    }
  }
}

function _getplatform(platform) {
  if (mappingCoin[platform]) {
    return mappingCoin[platform];
  }

  return platform;
}