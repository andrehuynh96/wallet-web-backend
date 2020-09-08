const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./get-min-amount.controller');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./get-min-amount.request-chema');
const router = express.Router();

router.post(
  '/min-amount',
  authenticate,
  validator(requestSchema),
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/exchange/min-amount:
 *   post:
 *     summary: min amount
 *     tags:
 *       - Exchange
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - from_currency
 *            - to_currency
 *            example:
 *               {
                        "from_currency":"btc",
                        "to_currency":"eth",
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": "0.00727689"
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

