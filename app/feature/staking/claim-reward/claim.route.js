const express = require('express');
const controller = require('./claim.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();
const { create } = require('./validator');
const validator = require("app/middleware/validator.middleware");

router.get(
  '/claim-rewards/histories',
  authenticate,
  controller.getClaimHistories
);

router.post(
  '/claim-rewards',
  authenticate,
  validator(create),
  controller.create
);

router.get(
  '/claim-rewards/settings',
  authenticate,
  controller.setting
);

module.exports = router;

/*********************************************************************/



/**
 * @swagger
 * /web/staking/claim-rewards/histories:
 *   get:
 *     summary: get claim histories
 *     tags:
 *       - staking reward
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
* /web/staking/claim-rewards:
*   post:
*     summary: claim-reward
*     tags:
*       - staking reward
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
*            - latest_id
*            example:
*               {
                       "amount": 250.039697,
                       "currency_symbol":"ETH",
                       "member_account_id":1,
                       "latest_id": 102
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
                     "amount": 1,
                     "original_amount": 2,
                     "network_fee":1
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
 * /web/staking/claim-rewards/settings:
 *   get:
 *     summary: get claim setting
 *     tags:
 *       - staking reward
 *     description:
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                "data": {
                  "minimun_claim_amount_atom":50,
                  "minimun_claim_amount_iris":50,
                  "minimun_claim_amount_ong":50,
                  "minimun_claim_amount_xtz":50,
                  "minimun_claim_amount_one":50,
                  "claim_amount_atom_network_fee":50,
                  "claim_amount_iris_network_fee":50,
                  "claim_amount_ong_network_fee":50,
                  "claim_amount_xtz_network_fee":50,
                  "claim_amount_one_network_fee":50
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
