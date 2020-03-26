const Joi = require('joi');
const ActionTypes = require('app/model/wallet/value-object/member-activity-action-type');
const Platforms = require('app/model/wallet/value-object/platform').map(ele => ele.symbol);

let types = Object.keys(ActionTypes);

const schema = Joi.object().keys({
	tx_id: Joi.string().required(),
	platform: Joi.string().valid(Platforms).optional(),
	symbol: Joi.string().required(),
	amount: Joi.number().optional(),
	action: Joi.string().valid(types).required(),
	send_email_flg: Joi.boolean().optional(),
	memo: Joi.string().optional()
});

module.exports = schema;