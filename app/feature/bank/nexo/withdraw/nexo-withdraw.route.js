const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-withdraw.controller');
const router = express.Router();

router.post(
  '/withdraw',
  authenticate,
  controller.withdraw
)

router.post(
  '/withdraw/verify',
  authenticate,
  controller.verify
)

module.exports = router;

/**********************************************************************/

/**
 * @swagger
 * /web/bank/nexo/withdraw:
 *   post:
 *     summary: create witdraw
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - nexo_id
 *            - wallet_id
 *            - wallet_address
 *            - platform
 *            - amount
 *            - currency_id
 *            example:
 *               {
                    "nexo_id":"",
                    "wallet_id": "",
                    "wallet_address": "",
                    "platform": "",
                    "amount": 10,
                    "currency_id": "",
                    "tag": ""
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
                        "id": "id",
                        "wallet_id": "wallet_id",
                        "nexo_member_id": "nexo_member_id",
                        "nexo_id": "nexo_id",
                        "type": "type",
                        "platform": "platform",
                        "nexo_currency_id": "nexo_currency_id",
                        "amount": "amount",
                        "total_fee": "total_fee",
                        "address": "address",
                        "memo": "memo",
                        "short_name": "short_name",
                        "tx_id": "tx_id",
                        "status": "status",
                        "response": "response",
                        "nexo_transaction_id": "nexo_transaction_id",
                        "device_code": "device_code",
                        "created_at": "created_at",
                        "updated_at": "updated_at"
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

/**
 * @swagger
 * /web/bank/nexo/withdraw/verify:
 *   post:
 *     summary: verify withdraw nexo
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - nexo_id
 *            - code
 *            - nexo_transaction_id
 *            example:
 *               {  
 *                  "nexo_id": "",
                    "code":"41827922",
                    "nexo_transaction_id": ""
                  }
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