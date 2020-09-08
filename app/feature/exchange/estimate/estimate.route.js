const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./estimate.controller');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./estimate.request-schema');
const router = express.Router();

router.post(
  '/estimate',
  authenticate,
  validator(requestSchema),
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/exchange/estimate:
 *   post:
 *     summary: estimate
 *     tags:
 *       - Exchange
 *     description: For case Fix rate will response {id,from, to, result, amount_from, amount_to},  not fix rate {from, to, result, network_fee, amount, visible_amount,rate,fee }
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - from_currency
 *            - to_currency
 *            - amount
 *            - fix_rate
 *            example:
 *               {
                        "from_currency":"btc",
                        "to_currency":"eth",
                        "amount": 1,
                        "fix_rate": false
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
 *                    "from": "btc",
                      "to": "eth",
                      "network_fee": "0.0291700000000000000000",
                      "amount": "1",
                      "result": "28.98157827",
                      "visible_amount": "29.2441911144578313253",
                      "rate": "29.2441911144578313253",
                      "fee": "0.1169767644578313253012",
                      "id": "fe8993badf88c62f6c1e4d505d8a44b392f59d842e8023a9b3c601d627c1a3495d254d3cedd72571f3408f616230e7e11310bf82011d0bed6cc11b158662d4f395bac63aec2c73d565436f53c124392ef9",
                      "amount_from": "1",
                      "amount_to": "28.10839175"
 *                  }
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

