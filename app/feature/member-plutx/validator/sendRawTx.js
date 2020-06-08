const Joi = require('joi');
const PlutxUserAddressAction = require("app/model/wallet/value-object/plutx-user-address");
let keys = Object.values(PlutxUserAddressAction);

const schema = Joi.object().keys({
  rawTx: Joi.string().required(),
  action: Joi.string().valid(keys).required()
});

module.exports = schema;