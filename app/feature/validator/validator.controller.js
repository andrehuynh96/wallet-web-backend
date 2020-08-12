const logger = require('app/lib/logger');
const config = require('app/config');
const Validator = require('app/model/wallet').validators;
const mapper = require('app/feature/response-schema/validator.response-schema');

module.exports = {
  get: async (req, res, next) => {
    try {
      logger.info('validator::list');
      let platform = req.params.platform ? req.params.platform.toUpperCase() : null
      if(!platform)
        throw 'Missing platform'
      let where = {
        platform: platform
      };
      let items = await Validator.findAll({where: where});

      return res.ok(mapper(items));
    }
    catch (err) {
      logger.error('get list validator fail:', err);
      next(err);
    }
  }
}