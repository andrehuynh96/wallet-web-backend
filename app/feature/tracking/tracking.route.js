const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const schema = require('./tracking.request-schema');
const controller = require('./tracking.controller');
const router = express.Router();

router.post(
  '/tracking',
  authenticate,
  validator(schema),
  controller.tracking
);

router.get(
  '/tracking/history',
  authenticate,
  controller.getHis
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/tracking:
 *   post:
 *     summary: tracking API
 *     tags:
 *       - Tracking
 *     description: record members' action such as send coin/token, confirm/cancel transaction
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data of action
 *         schema:
 *            type: object
 *            required:
 *            - tx_id
 *            - symbol
 *            - action
 *            example:
 *               {
                        "tx_id":"0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                        "platform":"ETH",
                        "symbol":"IFNT",
                        "amount":10,
                        "action":"SEND",
                        "send_email_flg":true,
                        "memo":"memo"
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
                      "id": "1",
                      "member_id": "fc59fa67-c05a-493b-bba5-1a1d823f1aad",
                      "tx_id": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                      "platform": "ETH",
                      "symbol": "IFNT",
                      "amount": 10,
                      "action": "SEND",
                      "send_email_flg": true,
                      "memo": "memo",
                      "updatedAt": "2020-03-26T14:43:55.174Z",
                      "createdAt": "2020-03-26T14:43:55.174Z"
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

/*********************************************************************/


/**
 * @swagger
 * /web/tracking/history:
 *   get:
 *     summary: get transaction history
 *     tags:
 *       - Tracking
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
 *       - name: platform
 *         in: query
 *         type: string
 *       - name: tx_id
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
 *                 "data": {
                      "items": [
                        {
                          "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                          "platform": "ETH",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "estimate_earn_per_year":"10",
                          "lockup_unvote":21,
                          "lockup_unvote_unit":"DAY",
                          "payout_reward":0,
                          "payout_reward_unit":"DAY",
                          "status":1,
                          "confirmation_block":5,
                          "staking_type":"CONTRACT",
                          "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "validator_address":null,
                          "deleted_flg":false,
                          "created_by":0,
                          "updated_by":0,
                          "createdAt":"2020-01-13T06:47:41.248Z",
                          "updatedAt":"2020-01-13T06:47:41.248Z"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 4
 *                 }
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