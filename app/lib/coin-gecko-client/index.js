const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
module.exports = {
    getPrice: async ({platform_name, currency}) => {
      try {
        logger.info('getPrice: getPrice');
        console.log('platform_name', platform_name)
        const coinGeckoClient = new CoinGecko();
        const coinPrices = await coinGeckoClient.simple.price({
          ids: [Platform[platform_name].name],
          vs_currencies: [currency]
        });
        return coinPrices.data[Platform[platform_name].name.toLowerCase()][currency];
      }
      catch (err) {
        logger.info('coinGeckoClient.simple.price no found data with currency' + platform_name);
        throw err;  
      }
    }
}