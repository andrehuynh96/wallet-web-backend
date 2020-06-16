const express = require('express');
const controller = require('./member.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/member/member_type',
  authenticate,
  controller.getMemberType
);

router.get(
  '/member/payment_accounts',
  authenticate,
  controller.getMemberAccount
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/membership/member/member_type:
 *   get:
 *     summary: member_type
 *     tags:
 *       - membership
 *     description: get infor member type
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
                      "id": 0,
                      "name": "",
                      "price": 0,
                      "type": "",
                      "display_order": 0
                    }, 
                    {
                      "id": 0,
                      "name": "",
                      "price": 0,
                      "type": "",
                      "display_order": 0
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
 * /web/membership/member/payment_accounts:
 *   get:
 *     summary: get payment_accounts
 *     tags:
 *       - membership
 *     description: get payment_accounts bank and crypto
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
                      "id": 1,
                      "type": "Bank",
                      "currency_symbol": "",
                      "account_number": "",
                      "bank_name": "",
                      "branch_name": "",
                      "account_name": "",
                    },
                    {
                      "id": 1,
                      "type": "Crypto",
                      "currency_symbol": "",
                      "wallet_address": ""
                    },
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
