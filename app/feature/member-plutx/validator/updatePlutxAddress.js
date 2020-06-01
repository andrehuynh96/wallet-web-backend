const Joi = require('joi');
const PlutxUserAddressAction = require("app/model/wallet/value-object/plutx-user-address");
let keys = Object.values(PlutxUserAddressAction);

const schema = Joi.object().keys({
  subdomain: Joi.string().required(), 
  crypto: Joi.string().required(), 
  address: Joi.string().required().allow(''), 
  sig: Joi.string().required(),
  walletID: Joi.string().required().allow(''),
  action: Joi.string().valid(keys).required()
});

module.exports = schema;