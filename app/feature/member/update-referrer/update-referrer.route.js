const express = require("express");
const controller = require('./update-referrer.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./update-referrer.request-schema');
const router = express.Router();

router.put(
  '/me/referrer',
  validator(requestSchema),
  authenticate,
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/me/referrer:
 *   put:
 *     summary: update referrer
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to switch 2fa status.
 *         schema:
 *            type: object
 *            required:
  *            - referrer_code
  *            properties:
 *              referrer_code:
 *                type: string
 *            example:
 *                  {
                          "referrer_code":"EFRTS4FER"
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