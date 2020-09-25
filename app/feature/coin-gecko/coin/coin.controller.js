const logger = require('app/lib/logger');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const Platform = require('app/model/wallet/value-object/platform');
const { getDateRangeUnitTimeStamp } = require('app/lib/utils');

module.exports = {
  getPrice: async (req, res, next) => {
    try {
      const platform = req.query.platform;

      if (!Platform[platform]) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const price = await coinGeckoClient.getPrice({ platform_name: platform, currency: 'usd' });

      return res.ok(price);
    }
    catch (error) {
      logger.error('get price of platform fail', error);
      next(error);
    }
  },
  getHistories: async (req, res, next) => {
    try {
      const { date_type, platform } = req.query;
      const date_num = req.query.date_num || 1;
      if (!date_type || !TimeUnit[date_type.toUpperCase()] || !Platform[platform]) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const { from, to } = getDateRangeUnitTimeStamp(date_type.toUpperCase(), date_num);
      const histories = await coinGeckoClient.getHistories({
        platform_name: platform,
        from: from,
        to: to
      })

      return res.ok(histories);
    }
    catch (error) {
      logger.error('get price history of platform fail', error);
      next(error);
    }
  },
  getMultiPrice: async (req,res,next)=> {
    try {
      const platforms = req.query.platforms;
      const platformList = platforms.split(',');
      let supportPlatforms = Object.values(Platform).reduce((result,value)=> {
        result[value.symbol] = value;
        return result;
      },{});

      if(!platforms || platformList.length == 0) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const notFoundList = [];
      platformList.forEach(item => {
        if (!supportPlatforms[item]) {
          notFoundList.push(item);
        }
      });

      if (notFoundList.length > 0) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER",{field: notFoundList });
      }

      const coingeckoIds = platformList.map(item => supportPlatforms[item].coingeckoId );
      const result = await coinGeckoClient.getMultiPrice(coingeckoIds);
      return res.ok(result);
    }
    catch (error) {
      logger.error('get price of multi platform fail', error);
      next(error);
    }
  }
}
