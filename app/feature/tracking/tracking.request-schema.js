const Joi = require('joi');
const ActionTypes = require('app/model/wallet/value-object/member-activity-action-type');

let types = Object.keys(ActionTypes);

const schema = Joi.object().keys({
	tx_id: Joi.string().required(),
	platform: Joi.string().optional(),
	symbol: Joi.string().required(),
	amount: Joi.number().optional(),
	from_address: Joi.string().required(),
	to_address: Joi.string().required(),
	action: Joi.string().valid(types).required(),
	send_email_flg: Joi.boolean().optional(),
	note: Joi.string().optional().allow(""),
	plan_id: Joi.string().optional().allow("").uuid()
});

module.exports = schema;
