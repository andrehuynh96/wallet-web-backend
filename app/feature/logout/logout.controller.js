const logger = require('app/lib/logger');

module.exports = async (req, res, next) => {
  try {
    req.session.authenticated = undefined;
    req.session.user = undefined;
    return res.ok(true);
  } catch (error) {
    logger.error('logout: ', error);
    next(error);
  }
}