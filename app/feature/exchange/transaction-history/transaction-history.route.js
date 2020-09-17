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
                      "id": "15b47700-40e2-40fe-b5cb-87c236423d48",
                      "provider": "CHANGELLY",
                      "member_id": "f56476cf-dff7-4d83-aaec-3e4f51a7f270",
                      "from_currency": "btc",
                      "to_currency": "eth",
                      "request_recipient_address": "0x95970e5869799a6d7b8efe5dc7bcbedd4b95b604",
                      "request_amount": null,
                      "request_extra_id": "",
                      "request_refund_address": "",
                      "request_refund_extra_id": "",
                      "rate_id": null,
                      "transaction_id": "1blw03boa83k5tnh",
                      "transaction_date": "2020-09-08T05:06:36.000Z",
                      "provider_fee": "0.4",
                      "api_extra_fee": "0",
                      "payin_extra_id": null,
                      "payout_extra_id": null,
                      "status": "NEW|WAITING|CONFIRMING|EXCHANGING|SENDING|FINISHED|FAILED|REFUNDED|EXPIRED|OVERDUE|HOLD",
                      "amount_expected_from": "1",
                      "amount_expected_to": "29.61103860",
                      "amount_to": "0",
                      "payin_address": "3AxCrxtX4qv479oLYzM7pjnvWWnVkhnNYZ",
                      "payout_address": "0x95970e5869799a6d7b8efe5dc7bcbedd4b95b604",
                      "created_at": "2020-09-08T05:06:38.673Z"
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