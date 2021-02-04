const logger = require('app/lib/logger');
module.exports = {
  index: async (req, res, next) => {
    try {
      console.log(req.body);
      logger.info(req.body);
      return res.ok(true);
    } catch (err) {
      logger.error('get nexo transaction fail: ', err);
      next(err)
    }
  }
}