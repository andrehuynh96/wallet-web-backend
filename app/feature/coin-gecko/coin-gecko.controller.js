const logger = require('app/lib/logger');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const Platform = require('app/model/wallet/value-object/platform');
const moment = require('moment');
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
      next();
    }
  },
  getHistories: async (req, res, next) => {
    try {
      const { date_type, platform } = req.query;

      if (!date_type || !TimeUnit[date_type.toUpperCase()] || !Platform[platform]) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const { from, to } = _getDateRangeUnitTimeStamp(date_type.toUpperCase());
      const histories = await coinGeckoClient.getHistories({
        platform_name: platform,
        from: from,
        to: to
      })

      return res.ok(histories);
    }
    catch (error) {
      logger.error('get price history of platform fail', error);
      next();
    }
  }
};

function _getDateRangeUnitTimeStamp(dateType) {
  const today = new Date();
  let fromDate = 0;
  const toDate = moment(today).valueOf();
  switch (dateType) {
    case 'MINUTE': {
      fromDate = moment(today).subtract(1, 'minute').valueOf();
      break;
    }
    case 'HOUR': {
      fromDate = moment(today).subtract(1, 'hour').valueOf();
      break;
    }
    case 'DAY': {
      fromDate = moment(today).subtract(24, 'hour').valueOf();
      break;
    }
    case 'WEEK': {
      fromDate = moment(today).subtract(7, 'day').valueOf();
    }
    case 'MONTH': {
      fromDate = moment(today).subtract(1, 'month').valueOf();
      break;
    }
    case 'YEAR': {
      fromDate = moment(today).subtract(1, 'year').valueOf();
      break;
    }
    default: {
      fromDate = moment(today).subtract(24, 'hour').valueOf();
      break;
    }
  }
  const from = Math.floor(fromDate / 1000); // second
  const to = Math.floor(toDate / 1000);
  return {
    from: from,
    to: to
  }
}
