const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create, sort} = require('./validator');
const controller = require('./wallet-token.controller');

const router = express.Router();

router.post(
  '/wallets/:wallet_id/tokens',
  authenticate,
  validator(create),
  controller.create
);

router.get(
    '/wallets/:wallet_id/tokens',
    authenticate,
    controller.all
);

router.get(
    '/wallets/:wallet_id/tokens/:id',
    authenticate,
    controller.get
);

router.delete(
  '/wallets/:wallet_id/tokens/:id',
  authenticate,
  controller.delete
);

router.post(
  '/wallets/:wallet_id/tokens/:id/private',
  authenticate,
  controller.getPrivKey
);

router.put(
  '/wallets/:wallet_id/tokens/sort',
  authenticate,
  validator(sort),
  controller.sort
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/wallets/{wallet_id}/tokens:
 *   post:
 *     summary: add token
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet token.
 *         schema:
 *            type: array
 *            required:
 *            - sc_token_address
 *            - platform
 *            example:
 *               {     
                    "sc_token_address": "",
                    "platform": "",
                    "symbol": "",
                    "decimals": 18,
                    "name": "",
                    "icon": "",
                    "ref_id": ""
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
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",     
                        "platform":"",
                        "sc_token_address": "",
                        "symbol": "",
                        "name": "",
                        "decimals":  18,
                        "icon": "",
                        "ref_id": "",
                        "created_at":""
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
 *   get:
 *     summary: get tokens of wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true  
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: order_by
 *         in: query
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  
               "data": {
                 "items": [{
                      "id": "656b6f1c-1039-11ea-8d71-362b9e155667",     
                        "platform":"",
                        "sc_token_address": "",
                        "symbol": "",
                        "name": "",
                        "decimals":  18,
                        "icon": "",
                        "ref_id": "",
                        "created_at":""
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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
 * /web/wallets/{wallet_id}/tokens/{id}:
 *   get:
 *     summary: get token
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
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
               "data": {
                    "id": "656b6f1c-1039-11ea-8d71-362b9e155667",     
                    "platform":"",
                    "sc_token_address": "",
                    "symbol": "",
                    "name": "",
                    "decimals":  18,
                    "icon": "",
                    "ref_id": "",
                    "created_at":""
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
 *   delete:
 *     summary: delete token
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
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
 *                 "data":{
                      "deleted": true
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
 * /web/wallets/{wallet_id}/tokens/{id}/private:
 *   post:
 *     summary: get encrypted private key
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            optional:
 *            - twofa_code
 *            example:
 *               {     
                    "twofa_code": "123456"
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
                        "encrypted_private_key": ""
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
 * /web/wallets/{wallet_id}/tokens/sort:
 *   put:
 *     summary: update order index
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet private key.
 *         schema:
 *            type: array
 *            required:
 *            - items
 *            example:
 *               {
                    "items": [
                        { "symbol":"BNR", "platform":"ETH", "index": 1 },
                        { "symbol":"USDT", "platform":"ETH", "index": 2 },
                        { "symbol":"INFT", "platform":"ETH", "index": 3 },
                        { "symbol":"MOO", "platform":"ETH", "index": 4 }
                    ]
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