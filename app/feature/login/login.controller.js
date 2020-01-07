const logger = require('app/lib/logger');

module.exports = async (req, res, next) => {
  try {
    let user = null;// implement login business
    req.session.authenticated = true;
    req.session.user = user;
    return res.ok(user);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
