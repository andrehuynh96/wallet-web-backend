const Joi = require("joi");
const OtpType = require("app/model/wallet/value-object/otp-type");
let keys = Object.values(OtpType);

const schema = Joi.object().keys({
  email: Joi.string().email({
    minDomainAtoms: 2
  }).required(),
  type: Joi.string().valid(keys).required()
});

module.exports = schema;