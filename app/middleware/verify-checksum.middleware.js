const logger = require('app/lib/logger');
const crypto = require('crypto');
const config = require('app/config');
const ApiKey = require("app/model/wallet").api_keys;
const Joi = require("joi");

module.exports = async function (req, res, next) {
  let data = _getData(req);
  let { 'x-time': time, 'x-checksum': checkSum, 'api-key': apiKey } = req.headers;
  const validate = Joi.validate({
    'api-key': apiKey,
    'x-time': time,
    'x-checksum': checkSum,
  }, {
      'api-key': Joi.string().required(),
      'x-time': Joi.string().required(),
      'x-checksum': Joi.string().required()
    });

  if (validate.error) {
    return res.badRequest(validate.error, "MISSING_PARAMETERS");
  }

  let key = await ApiKey.findOne({
    where: {
      api_key: apiKey,
      actived_flg: true
    }
  });
  if (!key) {
    return res.badRequest(res.__("NOT_FOUND_APIKEY"), "NOT_FOUND_APIKEY", { fields: ["api-key"] });
  }

  const content = `${key.secret}
${req.method}
${req.baseUrl}${req.path}
${JSON.stringify(data)}
${time}`;

  const hash = crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');

  if (hash != checkSum) {
    return res.badRequest(res.__("WRONG_CHECKSUM"), "WRONG_CHECKSUM", { fields: ["x-checksum"] });
  }
  next();
};


function _getData(req) {
  return req.method.toLowerCase() == 'get' ? req.query : req.body;
}