const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const cache = redis.client();
const mappingCoin = {
  "BTCSW": "BTC"
}

module.exports = {
  getPrice: async ({ platform_name, currency }) => {
    try {
      platform_name = (platform_name || '').trim();
      let usd_24h_change;
      if (platform_name === "USDT") {
        return  {
          price: 1,
          usd_24h_change: 0,
        };
      }

      platform_name = _getPlatform(platform_name);
      logger.info('getPrice: getPrice');
      const key = platform_name + '_' + currency;
      let price = await cache.getAsync(key);
      if (price === null) {
        const coinGeckoClient = new CoinGecko();
        const coinPrices = await coinGeckoClient.simple.price({
          ids: [Platform[platform_name].coingeckoId],
          vs_currencies: [currency],
          include_24hr_change: true
        });
        price = coinPrices.data[Platform[platform_name].coingeckoId.toLowerCase()][currency];
        usd_24h_change = coinPrices.data[Platform[platform_name].coingeckoId.toLowerCase()].usd_24h_change;
        //10p
        await cache.setAsync(key, price, "EX", 30);
      }
      return {
        price: price,
        usd_24h_change: usd_24h_change
      };
    }
    catch (err) {
      logger.info('coinGeckoClient.simple.price no found data with currency' + platform_name);
      throw err;
    }
  },
  getHistories: async ({ platform_name, from, to }) => {
    try {
      if (platform_name == "USDT") {
        return 1;
      }
      platform_name = _getPlatform(platform_name);
      const coinGeckoClient = new CoinGecko();
      const coingeckoId = Platform[platform_name].coingeckoId;
      const coinHistories = await coinGeckoClient.coins.fetchMarketChartRange(coingeckoId, { from: from, to: to });
      return coinHistories.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.coins.fetchMarketChartRange no found data with currency' + platform_name);
      throw error;
    }
  },
  getTokenPrice: async({ coingecko_id, contract_addresses }) => {
    try {
      const coinGeckoClient = new CoinGecko();
      const tokenPrices = await coinGeckoClient.simple.fetchTokenPrice({
        ids: coingecko_id,
        contract_addresses : contract_addresses,
        vs_currencies: 'usd',
        include_24hr_change: true
      });
      return tokenPrices.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.simple.token_price no found data with currency and contract address' + contract_addresses);
      throw error;
    }
  },
  getTokenHistories: async ({ coingecko_id, contract_addresses , from, to }) => {
    try {
      const coinGeckoClient = new CoinGecko();
      const tokenHistories = await coinGeckoClient.coins.fetchCoinContractMarketChartRange(contract_addresses,coingecko_id, { from: from, to: to });
      return tokenHistories.data;
    }
    catch (error) {
      logger.info('coinGeckoClient.coins.fetchCoinContractMarketChartRange no found data with contract address' + contract_addresses);
      throw error;
    }
  },
  getMultiPrice: async(platforms) => {
    try {
      const coinGeckoClient = new CoinGecko();
        const coinPrices = await coinGeckoClient.simple.price({
          ids: platforms,
          vs_currencies: 'usd',
          include_24hr_change: true
        });
      return coinPrices.data;

    } catch (error) {
      logger.info('coinGeckoClient.simple.price no found with platforms');
      throw error;
    }
  },
  getMarkets: async ({ platform_name }) => {
    try {
      if (platform_name == "USDT") {
      return 1;
      }
    platform_name = _getPlatform(platform_name);
    const coinGeckoClient = new CoinGecko();
    const coingeckoId = Platform[platform_name].coingeckoId;
    const result = await coinGeckoClient.coins.markets({
      ids: [coingeckoId],
      vs_currency: 'usd'
    });
      return result.data;
    }
    catch (err) {
      logger.info('coinGeckoClient.coins.markets no found data with' + platform_name);
      throw err;
    }
  }
}

function _getPlatform(platform) {
  if (mappingCoin[platform]) {
    return mappingCoin[platform];
  }

  return platform;
}
