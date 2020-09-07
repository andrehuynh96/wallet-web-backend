const express = require('express');
const controller = require('./transaction-history.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/transactions',
  authenticate,
  controller
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/exchange/transactions:
 *   get:
 *     summary: get transaction history
 *     tags:
 *       - Exchange
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: address
 *         in: query
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                "data": {
                  "items": [
                    {
                      id: "",
                      from_currency: "",
                      to_currency: "",
                      request_recipient_address: "",
                      request_amount: 0,
                      request_extra_id: "",
                      request_refund_address: "",
                      request_refund_extra_id: "",
                      transaction_id: "",
                      provider_fee: 0,
                      api_extra_fee: 0,
                      payin_address: "",
                      payin_extra_id: "",
                      payout_address: "",
                      payout_extra_id: "",
                      amount_expected_from: 0,
                      amount_expected_to: 0,
                      amount_to: 0,
                      status: "NEW",
                      transaction_date: "2020-01-07 20:22:04.728+09",
                      created_at: "2020-01-07 20:22:04.728+09",
                      updated_at: "2020-01-07 20:22:04.728+09"
                    }
                  ],
                  "offset": 0,
                  "limit": 10,
                  "total": 1
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