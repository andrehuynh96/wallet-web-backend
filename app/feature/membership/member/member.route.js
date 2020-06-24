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
  '/member/payment-accounts',
  authenticate,
  controller.getPaymentAccount
);

router.get(
  '/member/infor-ip',
  authenticate,
  controller.getInforIP
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
 * /web/membership/member/payment-accounts:
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
               "data": {
                    "bank_account": {
                      "id": 10,
                      "currency_symbol": "USD",
                      "account_number": "34268909879",
                      "bank_name": "Vietcombank",
                      "swift": "Vietcombank",
                      "account_name": "NGUYEN VAN A",
                      "payment_ref_code": "303962"
                    },
                    "crypto_accounts": [
                      {
                        "id": 9,
                        "currency_symbol": "ATOM",
                        "wallet_address": "cosmos1xxkueklal9vejv9unqu80w9vptyepfa95pd53u"
                      },
                      {
                        "id": 10,
                        "currency_symbol": "ETH",
                        "wallet_address": "0x32be343b94f860124dc4fee278fdcbd38c102d88"
                      }
                    ]
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