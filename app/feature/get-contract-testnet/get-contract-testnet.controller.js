const logger = require('app/lib/logger');

module.exports = {
  get: async (req, res, next) => {
    try {
      let contracts =  [
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
      },
       { address: '0xe6f34f4d95e72b9c0de87bfdb9edaa2aeb8f1721',
        name: 'Binary star',
        symbol: 'BNR',
        decimals: 18,
        total_supply: '10000000000',
        offical_site: 'https://binarystar.com/',
        is_verified: true,
        is_popular: false,
        cmc_id: '2047',
        ref_id: 'binarystar' 
      }
    ]

    if(req.query.keyword){
      let result = contracts.filter( x => x.name.includes(req.query.keyword) || x.symbol.includes(req.query.keyword) || x.address.includes(req.query.keyword))
      return res.ok({
        total: contracts.length,
        from: 0,
        to: contracts.length - 1,
        contracts: result
      });
    }
    else{
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