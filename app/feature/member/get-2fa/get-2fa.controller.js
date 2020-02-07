const logger = require('app/lib/logger');
const speakeasy = require("speakeasy");


module.exports = async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret();
    console.log(secret);
    return res.ok(secret.base32);
  }
  catch (err) {
    logger.error('getMe fail:', err);
    next(err);
  }
}