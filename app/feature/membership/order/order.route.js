const express = require('express');
const controller = require('./order.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();
const { createBank, createCrypto } = require('./validator');
router.get(
  '/orders',
  authenticate,
  controller.getOrders
);

router.post(
  '/orders/bank/make_payment',
  authenticate,
  validator(createBank),
  controller.makePayment
);

router.post(
  '/orders/crypto/make_payment',
  authenticate,
  validator(createCrypto),
  controller.makePayment
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
                      "member_account_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "account_number": "",
                      "bank_name": "",
                      "bracnch_name": "",
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
 * /web/membership/orders/bank/make_payment:
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
 *            - payment_ref_code
 *            - amount
 *            - account_number
 *            - bank_name
 *            - bracnch_name
 *            - account_holder
 *            - currency_symbol
 *            - payment_type
 *            example:
 *               {
                        "payment_ref_code":"123456",
                        "amount":100,
                        "account_number":"abc123456",
                        "bank_name":"CITIBANK",
                        "bracnch_name":"HCM",
                        "account_holder":"HCM",
                        "currency_symbol":"USD",
                        "payment_type":"BANK"
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
                      "member_account_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "account_number": "",
                      "bank_name": "",
                      "bracnch_name": "",
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

 
/**
 * @swagger
 * /web/membership/orders/crypto/make_payment:
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
 *            - amount
 *            - wallet_address
 *            - your_wallet_address
 *            - txid
 *            - rate_by_usdt
 *            - payment_type
 *            example:
 *               {
                        "wallet_address":"123456",
                        "amount":100,
                        "your_wallet_address":"",
                        "txid":"CITIBANK",
                        "bracnch_name":"HCM",
                        "rate_by_usdt":0,
                        "currency_symbol":"USD",
                        "payment_type":"CRYPTO"
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
                      "member_account_id": 0,
                      "membership_type_id": 0,
                      "payment_type": "",
                      "currency_symbol": "",
                      "amount": 0,
                      "account_number": "",
                      "bank_name": "",
                      "bracnch_name": "",
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