const logger = require('app/lib/logger');

module.exports = {
  get: async (req, res, next) => {
    try {
      return res.ok({
        total: 2,
        from: 0,
        to: 1,
        contracts: [
          { address: '0x0743392132d1a03a902c477e5a176f256ba3220c',
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
          { address: '0xefba28f458db27b93206500b1cb22c0d5fbf0ed6',
            name: 'Infinito Token',
            symbol: 'INFT',
            decimals: 6,
            total_supply: '101233.53',
            offical_site: 'https://infinito.com/',
            is_verified: true,
            is_popular: false,
            cmc_id: '2046',
            ref_id: 'infinito' 
          }
        ]
      });
    }
    catch (err) {
      logger.error("get coins: ", err);
      next(err);
    }
  }
}