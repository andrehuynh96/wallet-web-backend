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

router.get(
  '/tracking/:platform/:tx_id',
  authenticate,
  controller.getTxDetail
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
 *                {
                    "tx_id": "5a427cfb6ad59d49205bc6665c12fbc0e323b74662370da67ce5c1fbf04819d4",
                    "platform": "ETH",
                    "symbol": "IFNT",
                    "amount": 1.8987398240000002,
                    "to_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                    "from_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                    "action": "SEND",
                    "send_email_flg": true,
                    "note": "test create tracking",
                    "plan_id":"6d50c43f-b3d9-492a-a5b2-d1490dfcfdf6"
                }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": {
                      "tx_id": "5a427cfb6ad59d49205bc6665c12fbc0e323b74662370da67ce5c1fbf04819d4",
                      "platform": "ETH",
                      "symbol": "IFNT",
                      "amount": 1.898739824,
                      "action": "SEND",
                      "staking_platform_id": "160a08f8-3519-4573-90e4-08f832b518d2",
                      "plan_id": "6d50c43f-b3d9-492a-a5b2-d1490dfcfdf6",
                      "duration": 21,
                      "duration_type": "DAY",
                      "reward_percentage": 3.5,
                      "validator_fee": 1
                  }
              }
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
                              "tx_id": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                              "platform": "ETH",
                              "symbol": "IFNT",
                              "amount": 10,
                              "action": "SEND",
                              "memo": "memo"
                          },
                          {
                              "tx_id": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                              "platform": "ETH",
                              "symbol": "IFNT",
                              "amount": 10,
                              "action": "SEND",
                              "memo": "memo",
                              "staking_platform_id": "96b7f440-1a3b-11ea-978f-2e728ce88125",
                              "plan_id": "950002a9-07b4-41c1-990c-9290e5b73596",
                              "duration": 69,
                              "duration_type": "DAY",
                              "reward_percentage": 10,
                              "validator_fee": 20
                          },
                      ],
                      "offset": 0,
                      "limit": 2,
                      "total": 18
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
 * /web/tracking/{platform}/{tx_id}:
 *   get:
 *     summary: get transaction detail
 *     tags:
 *       - Tracking
 *     description: get one transaction detail based on platform and tx_id
 *     parameters:
 *       - name: platform
 *         in: path
 *         type: string
 *       - name: tx_id
 *         in: path
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
                      "tx_id": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                      "platform": "ETH",
                      "symbol": "IFNT",
                      "amount": 10,
                      "action": "SEND",
                      "memo": "memo",
                      "staking_platform_id": "96b7f440-1a3b-11ea-978f-2e728ce88125",
                      "plan_id": "950002a9-07b4-41c1-990c-9290e5b73596",
                      "duration": 69,
                      "duration_type": "DAY",
                      "reward_percentage": 10,
                      "validator_fee": 20
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
