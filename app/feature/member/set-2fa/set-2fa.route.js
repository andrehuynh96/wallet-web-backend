const express = require("express");
const controller = require('./set-2fa.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const schema = require("./set-2fa.request-schema");
const router = express.Router();

router.post(
  '/me/2fa',
  validator(schema),
  authenticate,
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/me/2fa:
 *   post:
 *     summary: update 2fa
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to register.
 *         schema:
 *            type: object
 *            required:
 *            - disable
 *            - twofa_code
  *            properties:
 *              twofa_secret:
 *                type: string
 *              twofa_code:
 *                type: string
 *              disable:
 *                type: boolean
 *            example:
 *                  {
                          "twofa_secret":"AIU45sdsahssdsjYUDHd6",
                          "twofa_code":"123456",
                          "disable":false
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

