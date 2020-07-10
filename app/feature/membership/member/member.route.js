const express = require('express');
const controller = require('./member.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/member/member-type',
  authenticate,
  controller.getMemberTypes
);

router.get(
  '/member/member-type/:id',
  authenticate,
  controller.getMemberTypeDetail
);

router.get(
  '/member/payment-accounts/crypto',
  authenticate,
  controller.getPaymentCryptoAccount
);

router.get(
  '/member/payment-accounts/allow-bank',
  authenticate,
  controller.allowBankMethod
);


router.get(
  '/member/infor-ip',
  authenticate,
  controller.getInforIP
);

router.get(
  '/member/crypto/price/:currency_symbol',
  authenticate,
  controller.getPrice
);

router.get(
  '/member/bank/price/:currency_symbol',
  authenticate,
  controller.getFiatPrice
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/membership/member/member-type:
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
* /web/membership/member/payment-accounts/crypto:
*   get:
*     summary: get payment crypto account
*     tags:
*       - membership
*     description: get payment crypto account
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
              "data":[
                     {
                       "id": 9,
                       "currency_symbol": "ATOM",
                       "wallet_address": "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u",
                      },
                     {
                       "id": 10,
                       "currency_symbol": "ETH",
                       "wallet_address": "0x32be343b94f860124dc4fee278fdcbd38c102d88",
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
* /web/membership/member/member-type/{id}:
*   get:
*     summary: member_type
*     tags:
*       - membership
*     description: get infor member type
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
               "data":
                   {
                     "id": 0,
                     "name": "",
                     "price": 0,
                     "type": "",
                     "display_order": 0
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
* /web/membership/member/crypto/price/{currency_symbol}:
*   get:
*     summary: member_type
*     tags:
*       - membership
*     description: get infor member type
*     parameters:
*       - in: path
*         name: currency_symbol
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
               "data":
                   {
                     "rate_usd": 1
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
 * /web/membership/member/infor-ip:
 *   get:
 *     summary: infor_ip
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
                  "data":{
                    "ip":"115.72.254.107",
                    "country_code":"VN",
                    "country_name":"Vietnam",
                    "region_code":"SG",
                    "region_name":"Ho Chi Minh",
                    "city":"Ho Chi Minh City",
                    "zip_code":"",
                    "time_zone":"Asia/Ho_Chi_Minh",
                    "latitude":10.8142,
                    "longitude":106.6438,
                    "metro_code":0
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
* /web/membership/member/bank/price/{currency_symbol}:
*   get:
*     summary: get reate fiat coin based on USD
*     tags:
*       - membership
*     description: Support JPY, USD
*     parameters:
*       - in: path
*         name: currency_symbol
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
                "data":{
                  "value":107,
                  "date":""
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
* /web/membership/member/payment-accounts/allow-bank:
*   get:
*     summary: Check allow bank method
*     tags:
*       - membership
*     description: Check allow bank method
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
               "data": true
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