const express = require("express");
const validator = require("app/middleware/validator.middleware");
const { resendEmail, resendVerify } = require("./validator");
const controller = require('./resend-email.controller');
const router = express.Router();

router.post(
  '/resend-email',
  validator(resendEmail),
  controller.resend
);

router.post(
  '/resend-verify-email',
  validator(resendVerify),
  controller.resendVerify
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/resend-email:
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
                        "type":"REGISTER|FORGOT_PASSWORD|UNSUBSCRIBE"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":true
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

 /**
 * @swagger
 * /web/resend-verify-email:
 *   post:
 *     summary: Resend expired Otp
 *     tags:
 *       - Accounts
 *     description: Resend expired Otp
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for resend verify email.
 *         schema:
 *            type: object
 *            required:
 *            - verify_token
 *            example:
 *               {
                        "verify_token":"NzFmYWJkNTMtN2ZlMy00NzY4LTlmOTctNTJkN2QxNDFlZDg2"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":true
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