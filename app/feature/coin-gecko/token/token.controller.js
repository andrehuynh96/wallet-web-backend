const logger = require('app/lib/logger');
const coinGeckoClient = require('app/lib/coin-gecko-client');
const TimeUnit = require('app/model/wallet/value-object/time-unit');
const { getDateRangeUnitTimeStamp } = require('app/lib/utils');

module.exports = {
  getTokenPrice: async(req,res,next) => {
    try {
      const { ref_id, contract_addresses } = req.query;
      if (!ref_id || !contract_addresses) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const tokenPrice = await coinGeckoClient.getTokenPrice({ coingecko_id: ref_id,contract_addresses: contract_addresses});

      return res.ok(tokenPrice);
    }
    catch (error) {
      logger.error('get token price of platform fail', error);
      next();
    }
  },

  getTokenHistories: async (req, res, next) => {
    try {
      const { date_type, ref_id, contract_addresses } = req.query;
      const date_num = req.query.date_num || 1;
      if (!date_type || !TimeUnit[date_type.toUpperCase()] || !ref_id || !contract_addresses) {
        return res.badRequest(res.__("MISSING_PARAMETER"), "MISSING_PARAMETER");
      }

      const { from, to } = getDateRangeUnitTimeStamp(date_type.toUpperCase(), date_num);
      const histories = await coinGeckoClient.getTokenHistories({
        coingecko_id: ref_id,
        contract_addresses: contract_addresses,
        from: from,
        to: to
      })

      return res.ok(histories);
    }
    catch (error) {
      logger.error('get price history of platform fail', error);
      next();
    }
  },
};
