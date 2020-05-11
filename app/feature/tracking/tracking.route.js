const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { create, update } = require('./validator');
const controller = require('./tracking.controller');
const router = express.Router();

router.post(
  '/tracking',
  authenticate,
  validator(create),
  controller.tracking
);

router.get(
  '/tracking/histories',
  authenticate,
  controller.getHis
);

router.get(
  '/tracking/:platform/:tx_id',
  authenticate,
  controller.getTxDetail
);

router.put(
  '/tracking/:platform/:tx_id',
  authenticate,
  validator(update),
  controller.update
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
                      "validator_fee": 1,
                      "domain_name": "a",
                      "member_domain_name": "a"
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
 * /web/tracking/histories:
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
                  "data": {
                      "items": [
                          {
                              "tx_id": "5a427cfb6ad59d49205bc6665c12fbc0e323b74662370da67ce5c1fbf04819e3",
                              "platform": "ETH",
                              "symbol": "IFNT",
                              "amount": 1.898739824,
                              "action": "SEND",
                              "sender_note": "test create tracking",
                              "receiver_note": "test create tracking",
                              "from_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                              "to_address": "aaa",
                              "domain_name": "a",
                              "member_domain_name": "a"
                          },
                          {
                              "tx_id": "5a427cfb6ad59d49205bc6665c12fbc0e323b74662370da67ce5c1fbf04819e3",
                              "platform": "ETH",
                              "symbol": "IFNT",
                              "amount": 1.898739824,
                              "action": "SEND",
                              "sender_note": "test create tracking",
                              "receiver_note": "test create tracking",
                              "from_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                              "to_address": "aaa"
                          }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 2
                  }
 *            }
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
                  "data": {
                      "tx_id": "0xf4c130082d64b9bc8ea25240e5873067613ed778c8d76905cfd5999e8ab9b63a",
                      "platform": "ETH",
                      "symbol": "IFNT",
                      "amount": 1.898739824,
                      "action": "SEND",
                      "staking_platform_id": "160a08f8-3519-4573-90e4-08f832b518d2",
                      "plan_id": "6d50c43f-b3d9-492a-a5b2-d1490dfcfdf6",
                      "duration": 21,
                      "duration_type": "DAY",
                      "sender_note": "test create tracking",
                      "receiver_note": "test create tracking",
                      "from_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                      "to_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                      "reward_percentage": 3.5,
                      "validator_fee": 1,
                      "domain_name": "a",
                      "member_domain_name": "a"
                  }
 *            }
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
* /web/tracking/{platform}/{tx_id}:
*   put:
*     summary: edit note
*     tags:
*       - Tracking
*     description: edit note of member transaction on platform and tx_id
*     parameters:
*       - name: platform
*         in: path
*         type: string
*       - name: tx_id
*         in: path
*         type: string
*       - in: body
*         name: data
*         description: Data for wallet.
*         schema:
*            type: object
*            example:
*               {
*                  "note": "TEST SENDER NOTE"
                }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true"
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