const path = require('path');
const config = require('app/config');

module.exports = {
  expiredVefiryToken: async (req, res, next) => {
    try {
      return res.ok(config.expiredVefiryToken);
    }
    catch (err) {
      logger.error('expiredVefiryToken fail:', err);
      next(err);
    }
  }
}