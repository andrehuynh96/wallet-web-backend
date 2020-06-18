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

module.exports = router;


/*********************************************************************/

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
                      "account_number": "",
                      "bank_name": "",
                      "branch_name": "",
                      "account_holder": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_by_usdt": 0,
                      "status": "",
                      "processe_date": ""
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
 *            - referrer_code
 *            - payment_ref_code
 *            - amount
 *            - account_number
 *            - bank_name
 *            - branch_name
 *            - account_name
 *            - currency_symbol
 *            - bank_account_id
 *            - membership_type_id
 *            example:
 *               {      "referrer_code": "as3421fs",
                        "payment_ref_code":"123456",
                        "amount":100,
                        "account_number":"abc123456",
                        "bank_name":"CITIBANK",
                        "branch_name":"HCM",
                        "account_name":"moonstake",
                        "currency_symbol":"USD",
                        "bank_account_id": 1,
                        "membership_type_id": 1
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
                      "branch_name": "",
                      "account_name": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_by_usdt": 0,
                      "status": "",
                      "processe_date": ""
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
 *            - referrer_code
 *            - receiving_addresses_id
 *            - amount
 *            - wallet_address
 *            - your_wallet_address
 *            - txid
 *            - currency_symbol
 *            - membership_type_id
 *            example:
 *               {      
                    "referrer_code": "as3421fs",
                    "receiving_addresses_id": 9,
                    "amount": 100,
                    "wallet_address": "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                    "your_wallet_address": "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd531",
                    "txid": "txcosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                    "currency_symbol": "ATOM",
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
                      "branch_name": "",
                      "account_holder": "",
                      "payment_ref_code": "",
                      "wallet_address": "",
                      "your_wallet_address": "",
                      "txid": "",
                      "rate_by_usdt": 0,
                      "status": "",
                      "processe_date": ""
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