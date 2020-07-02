const express = require('express');
const controller = require('./reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();
const { create } = require('./validator');
const validator = require("app/middleware/validator.middleware");

router.get(
  '/rewards',
  authenticate,
  controller.getRewards
);

router.get(
  '/reward-history',
  authenticate,
  controller.getRewardHistorys
);

router.post(
  '/claim-reward',
  authenticate,
  validator(create),
  controller.create
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/staking/rewards:
 *   get:
 *     summary: get reward current balance
 *     tags:
 *       - Staking
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                "data": [
                    {
                      "currency": "ETH",
                      "amount": "250.8"
                    },
                    {
                      "currency": "USD",
                      "amount": "1323364"
                    }
                  ]
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
 * /web/staking/reward-history:
 *   get:
 *     summary: get reward history
 *     tags:
 *       - Staking
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
                        "currency_symbol": "ETH",
                        "amount": "0.00001",
                        "created_at": "2020-03-27T08:36:56.308Z",
                        "updated_at": "2020-03-27T08:36:56.308Z"
                    },
                    {
                      "id": "6",
                      "currency_symbol": "ETH",
                      "amount": "5",
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

 /**
 * @swagger
 * /web/staking/claim-reward:
 *   post:
 *     summary: claim-reward
 *     tags:
 *       - Staking
 *     description: create claim request if call Affiliate update claimreward error, rollback data claim request
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for claim request.
 *         schema:
 *            type: object
 *            required:
 *            - amount
 *            - currency_symbol
 *            - member_account_id
 *            example:
 *               {    
                        "amount": 250.039697,
                        "currency_symbol":"ETH",
                        "member_account_id":1
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id": 1,
                      "member_id": 1,
                      "member_account_id": 1,
                      "type": "Crypto",
                      "status": "Approved",
                      "currency_symbol": "ETH",
                      "account_number": 0,
                      "bank_name": "",
                      "bracnch_name": "",
                      "account_name": "",
                      "account_holder": "",
                      "wallet_address": "0x1d5b6c8390b5d1c94c1042f3ae74c02070ce35ce",
                      "txid": "C52FD3D80BD7249D5094BDB5793317C2FCEBC221BCF313987AFA230A0518ECCD",
                      "updated_at": "2020-06-17 14:06:22",
                      "affiliate_claim_reward_id": "e8bdecb9-8cf4-468c-8ca3-3d58ca50924d",
                      "amount": 1
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