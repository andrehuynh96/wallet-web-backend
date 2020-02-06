const express = require("express");
const validator = require("app/middleware/validator.middleware");
const schema = require("./resend-otp.request-schema");
const controller = require('./resend-otp.controller');
const router = express.Router();

router.post(
  '/resend-otp',
  validator(schema),
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/resend-otp:
 *   post:
 *     summary: Resend Otp
 *     tags:
 *       - Accounts
 *     description: Resend Otp
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for register.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - type
 *            example:
 *               {
                        "email":"example@gmail.com",
                        "type":"REGISTER|FORGOT_PASSWORD|TWOFA"
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
                      "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34"
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