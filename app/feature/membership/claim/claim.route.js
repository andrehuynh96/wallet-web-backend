const express = require('express');
const controller = require('./claim.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();
const { create } = require('./validator');

router.get(
  '/claim-histories',
  authenticate,
  controller.getClaimHistories
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
 * /web/membership/claim-histories:
 *   get:
 *     summary: get claim historys
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
                          "id": 2,
                          "currency_symbol": "ETH",
                          "amount": "1.111",
                          "status": "Approved",
                          "txid": "C52FD3D80BD7249D5094BDB5793317C2FCEBC221BCF313987AFA230A0518ECCD",
                          "wallet_address": "0x1d5b6c8390b5d1c94c1042f3ae74c02070ce35ce",
                          "account_holder": "test",
                          "branch_name": "Tan son nhat",
                          "bank_name": "VCB",
                          "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                          "member_account_id": 1,
                          "type": "Bank",
                          "account_number": "test",
                          "affiliate_claim_reward_id": "e8bdecb9-8cf4-468c-8ca3-3d58ca50924d",
                          "updated_at": "2020-06-17T07:06:22.155Z"
                    },
                    {
                         "id": 3,
                          "currency_symbol": "ETH",
                          "amount": "1.111",
                          "status": "Approved",
                          "txid": "C52FD3D80BD7249D5094BDB5793317C2FCEBC221BCF313987AFA230A0518ECCD",
                          "wallet_address": "0x1d5b6c8390b5d1c94c1042f3ae74c02070ce35ce",
                          "account_holder": "test",
                          "branch_name": "Tan son nhat",
                          "bank_name": "VCB",
                          "member_id": "8337b3e4-b8be-4594-bca3-d6dba7c751ea",
                          "member_account_id": 1,
                          "type": "Bank",
                          "account_number": "test",
                          "affiliate_claim_reward_id": "e8bdecb9-8cf4-468c-8ca3-3d58ca50924d",
                          "updated_at": "2020-06-17T07:06:22.155Z"
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
 * /web/membership/claim-reward:
 *   post:
 *     summary: claim-reward
 *     tags:
 *       - membership
 *     description: claim reward
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
                        "amount": 1,
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