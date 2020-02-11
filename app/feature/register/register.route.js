const config = require("app/config");
const express = require("express");
const validator = require("app/middleware/validator.middleware");
const schema = require("./register.request-schema");
const controller = require('./register.controller');
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/register',
  validator(schema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/register:
 *   post:
 *     summary: Register
 *     tags:
 *       - Accounts
 *     description: Register Account
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for register.
 *         schema:
 *            type: object
 *            required:
 *            - g-recaptcha-response
 *            - email
 *            - password
 *            - phone
 *            example:
 *               {
                        "g-recaptcha-response":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "email":"example@gmail.com",
                        "password":"abc123456",
                        "phone":"0902907856",
                        "referrer_code":"WDRF3F1C"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                      "user":{
                        "id": "ad84f5a2-497d-11ea-b77f-2e728ce88125",
                        "email":"example@gmail.com", 
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "member_sts":"ACTIVATED",
                        "fullname":"Client",
                        "phone": "0909038232",
                        "date_of_birth": "22/09/2000",
                        "address": "123 Rood B",
                        "city": "HCM",
                        "post_code": "700000",
                        "country": "VN",
                        "referral_code": "RDFCSD4C",
                        "referrer_code": "WDRF3F1C",
                        "infinito_id": ""
                      }
                    }
 *             }
 *       400:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/400'
 *       401:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/401'
 *       404:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/404'
 *       500:
 *         description: Error
 *         schema:
 *           $ref: '#/definitions/500'
 */