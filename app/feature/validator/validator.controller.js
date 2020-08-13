const logger = require('app/lib/logger');
const config = require('app/config');
const stakingApi = require('app/lib/staking-api')

module.exports = {
  get: async (req, res, next) => {
    try {
      logger.info('validator::list');
      let platform = req.params.platform ? req.params.platform.toUpperCase() : null
      if(!platform)
        throw 'Missing platform'
        
     let item = await stakingApi.getValidators(platform)
      return res.ok(items);
    }
    catch (err) {
      logger.error('get list validator fail:', err);
      next(err);
    }
  }
}