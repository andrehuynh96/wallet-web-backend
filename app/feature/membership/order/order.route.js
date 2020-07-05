const express = require('express');
const controller = require('./order.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require("app/middleware/validator.middleware");
const router = express.Router();
const { createBank, createCrypto } = require('./validator');
router.get(
  '/orders',
  authenticate,
  controller.getOrders
);

router.post(
  '/orders/bank/make-payment',
  authenticate,
  validator(createBank),
  controller.makePaymentBank
);

router.post(
  '/orders/crypto/make-payment',
  authenticate,
  validator(createCrypto),
  controller.makePaymentCrypto
);
router.post(
  '/orders/:code/click',
  authenticate,
  controller.clickReferrerUrl
);

router.post(
  '/orders/:paymentType/purchased',
  authenticate,
  controller.isPurchased
);

module.exports = router;


/** *******************************************************************/

/**
 * @swagger
 * /web/membership/orders:
 *   get:
 *     summary: get order
 *     tags:
 *       - membership
 *     description: get list orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
               "data":
                    [{
                      "id": 0,
                      "member_id": 0,
                      "bank_account_id": 0,
                      "receiving_addresses_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "amount_usd": 0,
                      "account_number": "",
                      "bank_name": "",
                      "swift": "",
                      "account_holder": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_by_usd": 0,
                      "status": "",
                      "created_at": "",
					            "updated_at": ""
                    },]
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

/**
 * @swagger
 * /web/membership/orders/bank/make-payment:
 *   post:
 *     summary: make_payment
 *     tags:
 *       - membership
 *     description: make payment
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for order.
 *         schema:
 *            type: object
 *            required:
 *            - membership_type_id
 *            example:
 *               {
                    "membership_type_id":""
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
                      "id": 0,
                      "member_id": 0,
                      "bank_account_id": 0,
                      "receiving_addresses_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "amount_usd": 0,
                      "account_number": "",
                      "bank_name": "",
                      "branch_name":"",
                      "account_type":"regular",
                      "swift": "",
                      "account_name": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_usd": 0,
                      "status": "",
                      "updated_at": ""
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
 * /web/membership/orders/crypto/make-payment:
 *   post:
 *     summary: make_payment
 *     tags:
 *       - membership
 *     description: make payment
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for Payment.
 *         schema:
 *            type: object
 *            required:
 *            - receiving_addresses_id
 *            - amount
 *            - your_wallet_address
 *            - txid
 *            - membership_type_id
 *            example:
 *               {
                    "receiving_addresses_id": 9,
                    "amount": 100,
                    "your_wallet_address": "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd531",
                    "txid": "txcosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                    "membership_type_id": "88fda933-0658-49c4-a9c7-4c0021e9a071"
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
                      "id": 0,
                      "member_id": 0,
                      "bank_account_id": 0,
                      "receiving_addresses_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "account_number": "",
                      "bank_name": "",
                      "swift": "",
                      "account_holder": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_usd": 0,
                      "status": "",
                      "created_at": "",
                      "updated_at": ""
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
* /web/membership/orders/{code}/click:
*   post:
*     summary: Click Referrer Url
*     tags:
*       - membership
*     description: click referrer url
*     parameters:
*       - in: path
*         name: code
*         require: true
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                  "data": {
                      "num_of_clicks": 3
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

/**
* @swagger
* /web/membership/orders/{paymentType}/purchased:
*   post:
*     summary: Check payment
*     tags:
*       - membership
*     description: check payment order of user
*     parameters:
*       - in: path
*         name: paymentType [Bank|Crypto]
*         require: true
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                  "data": true|false
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