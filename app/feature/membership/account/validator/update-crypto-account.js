const Joi = require('joi');
const config = require("app/config");

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      currency_symbol: Joi.string().valid(config.membership.receivingRewardPlatform
      ).required(),
      wallet_id: Joi.string().required(),
      wallet_address: Joi.string().required()
    })
  )
});
module.exports = schema; 