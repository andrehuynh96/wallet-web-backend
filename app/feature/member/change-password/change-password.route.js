const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const requestSchema = require('./change-password.request-schema');
const controller = require('./change-password.controller');
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const config = require('app/config')

const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);

const router = express.Router();

router.post(
  '/me/change-password',
  authenticate,
  validator(requestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/me/change-password:
 *   post:
 *     summary: change password
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data.
 *         schema:
 *            type: object
 *            required:
 *            - password
 *            - new_password
  *            properties:
 *              password:
 *                type: string
 *              new_password:
 *                type: string
 *            example:
 *                  {
                          "password":"Abc123456",
                          "new_password":"123Abc123456",
                          "g-recaptcha-response":"fdsfdsjkljfsdfjdsfdhs"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
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