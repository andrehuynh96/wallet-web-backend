const ApiKey = require("app/model/wallet").api_keys;
const Joi = require("joi");
module.exports = async function (req, res, next) {
    let { 'api-key': apiKey } = req.headers;
    const validate = Joi.validate({
        'api-key': apiKey
    }, {
        'api-key': Joi.string().required()
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
    next();
}