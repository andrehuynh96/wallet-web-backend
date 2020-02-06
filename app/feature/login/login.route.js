const express = require('express');
const config = require('app/config')
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const validator = require('app/middleware/validator.middleware');
const loginRequestSchema = require('./login.request-schema');
const loginController = require('./login.controller');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/login',
  validator(loginRequestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  loginController
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Accounts
 *     description: if twofa == true then return verify_token otherwise return user object
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for login.
 *         schema:
 *            type: object
 *            required:
 *            - g-recaptcha-response
 *            - email
 *            - password
 *            example:
 *               {
                        "g-recaptcha-response":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "email":"example@gmail.com",
                        "password":"abc123456"
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
                      "twofa":true,
                      "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                      "user":{
                        "id": 1,
                        "email":"example@gmail.com",
                        "twofa_secret":"sCM87xx",
                        "twofa_enable_flg": true,
                        "create_at":"",
                        "member_sts":"ACTIVATED"
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
