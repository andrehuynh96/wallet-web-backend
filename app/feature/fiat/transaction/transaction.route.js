const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./transaction.controller');
const validator = require('app/middleware/validator.middleware');
const { estimate, create, update, get } = require('./validator');
const router = express.Router();

router.post(
  '/estimate',
  authenticate,
  validator(estimate),
  controller.estmate
);

router.post(
  '/transactions',
  authenticate,
  validator(update),
  controller.create
);

router.post(
  '/make-transaction',
  authenticate,
  validator(create),
  controller.make
);

router.put(
  '/transactions/:id',
  authenticate,
  validator(update),
  controller.update
);

router.get(
  '/transactions/:id',
  authenticate,
  controller.getTxById
)

router.get(
  '/transactions',
  authenticate,
  controller.getTxs
)

router.get(
  '/transactions/callback/:token',
  authenticate,
  controller.callback
)

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/fiat/estimate:
 *   post:
 *     summary: estimate
 *     tags:
 *       - Fiat
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - amount
 *            - source_currency
 *            - dest_currency
 *            - dest_address
 *            example:
 *               {
                        "source_currency":"USD",
                        "dest_currency":"BTC",
                        "amount": 1,
                        "dest_address": "moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR",
                        "country": "VN"
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
                    source_currency: 'USD',
                    source_amount: 6.68,
                    source_amount_without_fees: 1,
                    dest_currency: 'BTC',
                    dest_amount: 0.00007361,
                    exchange_rate: 0.0000736102,
                    equivalencies: {
                      GBP: 0.75,
                      BTC: 0.00007361,
                      NZD: 0.83,
                      ETH: 0.002493563657668414,
                      USDS: 0.965544,
                      AUD: 1.37,
                      CNY: 3.55,
                      MXN: 20.68,
                      PAX: 0.9655439193826385,
                      JPY: 63,
                      BRL: 1.68,
                      EUR: 0.82,
                      KRW: 618,
                      CAD: 1.29,
                      DAI: 2.0749824e-11,
                      HUSD: 0.96554392,
                      HKD: 4.49,
                      GUSD: 0.97,
                      USDT: 0,
                      USDC: 0.965544,
                      USD: 0.97,
                      BUSD: 0.9655439193826385
                    },
                    fees: { BTC: 0.00005, USD: 5 }
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
* /web/fiat/make-transaction:
*   post:
*     summary: make transaction
*     tags:
*       - Fiat
*     description:
*     parameters:
*       - in: body
*         name: data
*         description: Data.
*         schema:
*            type: object
*            required:
*            - amount
*            - source_currency
*            - dest_currency
*            - dest_address
*            - payment_method
*            example:
*               {
                       "source_currency":"USD",
                       "dest_currency":"BTC",
                       "amount": 1,
                       "dest_address": "moTXHK5dfgT62Y8XMM6RxRAVV8ojmofAnR",
                       "payment_method":"debit-card",
                       "redirect_url": "https://www.google.com",
                       "failure_redirect_url": "https://www.google.com"
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
                   url: "",
                   reservation: ""
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
* /web/fiat/transactions/{id}:
*   put:
*     summary: update transaction
*     tags:
*       - Fiat
*     description:
*     parameters:
*       - in: path
*         name: id
*         type: string
*         required: true
*       - in: body
*         name: data
*         description: Data.
*         schema:
*            type: object
*            required:
*            - order_id
*            example:
*               {
                       "order_id":""
                 }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": true
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
 * /web/fiat/transactions/{id}:
 *   get:
 *     summary: get transaction by id
 *     tags:
 *       - Fiat
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
 *                    "id":"",
 *                    "member_id":"",
 *                    "from_currency": "",
 *                    "to_cryptocurrency": "",
 *                    "payment_method": "",
 *                    "payment_method_name": ,
 *                    "from_amount": ,
 *                    "to_amount": ,
 *                    "to_address": "",
 *                    "payment_url": "",
 *                    "reservation": "",
 *                    "redirect_url": ,
 *                    "failure_redirect_url": ,
 *                    "rate": "",
 *                    "fee_currency": "",
 *                    "total_fee": "",
 *                    "fee_from": "",
 *                    "fee_to": "",
 *                    "fees": ,
 *                    "order_id": ,
 *                    "order_type": ,
 *                    "transaction_id": ,
 *                    "tx_id": ,
 *                    "transaction_status": ,
 *                    "status": "",
 *                    "provider": "",
 *                    "message": ,
 *                    "response": ,
 *                    "device_code": ,
 *                    "created_at": "",
 *                    "updated_at": ""
 *                }
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
 * /web/fiat/transactions:
 *   get:
 *     summary: get transaction by current log in user
 *     tags:
 *       - Fiat
 *     description:
  *     parameters:
 *       - in: query
 *         name: offset
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: limit
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: sort_field
 *         type: string
 *       - in: query
 *         name: sort_by
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *              "data": {
 *                "items": [
 *                  {
 *                    "id":"",
 *                    "from_currency": "",
 *                    "to_cryptocurrency": "",
 *                    "payment_method": "",
 *                    "payment_method_name": ,
 *                    "from_amount": ,
 *                    "to_amount": ,
 *                    "to_address": "",
 *                    "payment_url": "",
 *                    "reservation": "",
 *                    "redirect_url": ,
 *                    "failure_redirect_url": ,
 *                    "rate": "",
 *                    "fee_currency": "",
 *                    "total_fee": "",
 *                    "fee_from": "",
 *                    "fee_to": "",
 *                    "fees": ,
 *                    "order_id": ,
 *                    "order_type": ,
 *                    "transaction_id": ,
 *                    "tx_id": ,
 *                    "transaction_status": ,
 *                    "status": "",
 *                    "provider": "",
 *                    "message": ,
 *                    "response": ,
 *                    "device_code": ,
 *                    "created_at": "",
 *                    "updated_at": ""
 *                  }
 *                 ],
 *                 "offset": 0,
 *                 "limit": 10,
 *                 "total": 1
 *               }
 *              }
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
* /web/fiat/transactions:
*   post:
*     summary: create transaction
*     tags:
*       - Fiat
*     description:
*     parameters:
*       - in: body
*         name: data
*         description: Data.
*         schema:
*            type: object
*            required:
*            - order_id
*            example:
*               {
                       "order_id":""
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
*                     "success": true,
*                     "status": 1
*                   }
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