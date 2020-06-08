const Joi = require('joi');
const PlutxUserAddressAction = require("app/model/wallet/value-object/plutx-user-address");
let keys = Object.values(PlutxUserAddressAction);

const schema = Joi.object().keys({
  crypto: Joi.string().required(), 
  address: Joi.string().optional().allow(''),
  walletId: Joi.string().optional().allow(''),
  action: Joi.string().valid(keys).required()
});

module.exports = schema;