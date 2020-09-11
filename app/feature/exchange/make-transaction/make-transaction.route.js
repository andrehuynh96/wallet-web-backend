const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./make-transaction.controller');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./make-transaction.request-schema');
const router = express.Router();

router.post(
  '/make-transaction',
  authenticate,
  validator(requestSchema),
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/exchange/make-transaction:
 *   post:
 *     summary: make transaction
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
 *            - amount
 *            example:
 *               {
                      "from_currency": "btc",
                      "to_currency": "eth",
                      "amount": 1,
                      "address": "",
                      "extra_id": "",
                      "refund_address": "",
                      "refund_extra_id": "",
                      "rate_id": ""
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
 *                    "id": "15b47700-40e2-40fe-b5cb-87c236423d48",
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
                      "status": "NEW",
                      "amount_expected_from": "1",
                      "amount_expected_to": "29.61103860",
                      "amount_to": "0",
                      "payin_address": "3AxCrxtX4qv479oLYzM7pjnvWWnVkhnNYZ",
                      "payout_address": "0x95970e5869799a6d7b8efe5dc7bcbedd4b95b604",
                      "created_at": "2020-09-08T05:06:38.673Z"
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

