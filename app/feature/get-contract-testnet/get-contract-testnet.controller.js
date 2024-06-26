const logger = require('app/lib/logger');

module.exports = {
  get: async (req, res, next) => {
    try {
      let contracts = [
        {
          address: '0x0743392132d1a03a902c477e5a176f256ba3220c',
          name: 'Moonstake',
          symbol: 'MOO',
          decimals: 1,
          total_supply: '100000000',
          offical_site: 'https://moonstake.com/',
          is_verified: true,
          is_popular: false,
          cmc_id: '2045',
          ref_id: 'moonstake-3'
        },
        {
          address: '0x8f30ee44258967e2554278e0eef5cc909badd89e',
          name: 'MSToken',
          symbol: 'MST',
          decimals: 8,
          total_supply: '10000',
          offical_site: 'https://moonstake.io/',
          is_verified: true,
          is_popular: false,
          cmc_id: '2046',
          ref_id: 'moonstake'
        },
        {
          address: '0xe6f34f4d95e72b9c0de87bfdb9edaa2aeb8f1721',
          name: 'Binary star',
          symbol: 'BNR',
          decimals: 18,
          total_supply: '10000000000',
          offical_site: 'https://binarystar.com/',
          is_verified: true,
          is_popular: false,
          cmc_id: '2047',
          ref_id: 'binarystar'
        },
        {
          address: '0x0736d0c130b2ead47476cc262dbed90d7c4eeabd',
          name: 'USDT',
          symbol: 'USDT',
          decimals: 6,
          total_supply: '37200000',
          offical_site: 'https://usdt.com/',
          is_verified: true,
          is_popular: false,
          cmc_id: '2048',
          ref_id: 'usdt'
        }
      ]

      if (req.query.keyword) {
        let result = contracts.filter(x => x.name.includes(req.query.keyword) || x.symbol.includes(req.query.keyword) || x.address.includes(req.query.keyword))
        return res.ok({
          total: contracts.length,
          from: 0,
          to: contracts.length - 1,
          contracts: result
        });
      }
      else {
        let result = contracts
        return res.ok({
          total: contracts.length,
          from: 0,
          to: contracts.length - 1,
          contracts: result
        });
      }

    }
    catch (err) {
      logger.error("get coins: ", err);
      next(err);
    }
  }
}