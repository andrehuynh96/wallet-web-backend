const express = require('express');
const controller = require('./member-reward-transaction-his.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/member/reward-transaction-history',
  authenticate,
  controller.getAll
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/membership/member/reward-transaction-history:
 *   get:
 *     summary: get reward transaction history
 *     tags:
 *       - membership
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
 *       - name: order_by
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
                      "id": "7",
                      "commission_method": "",
                      "commission_from": "",
                      "currency_symbol": "USDT",
                      "amount": 1,
                      "action": "PAYOUT_REQUEST",
                      "tx_id": "",
                      "note": "",
                      "platform": "ETH",
                      "created_at": "2020-03-27T08:36:56.308Z",
                      "updated_at": "2020-03-27T08:36:56.308Z"
                    }
                  ],
                  "offset": 0,
                  "limit": 10,
                  "total": 5
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