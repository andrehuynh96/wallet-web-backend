const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create, update, sort } = require('./validator');
const controller = require('./wallet-private-key.controller');

const router = express.Router();

router.post(
  '/wallets/:wallet_id/keys',
  authenticate,
  validator(create),
  controller.create
);

router.put(
  '/wallets/:wallet_id/keys',
  authenticate,
  validator(update),
  controller.update
)
router.delete(
  '/wallets/:wallet_id/keys/:id',
  authenticate,
  controller.delete
);

router.post(
  '/wallets/:wallet_id/keys/:id/private',
  authenticate,
  controller.getPrivKey
);

router.put(
  '/wallets/:wallet_id/coins/sort',
  authenticate,
  validator(sort),
  controller.sort
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/wallets/{wallet_id}/keys:
 *   post:
 *     summary: add coins
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
 *               { items: [    
                    { "encrypted_private_key": "",
                    "platform": "",
                    "address": "",
                    "hd_path": ""}]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[{
                        "id": "656b6f1c-1039-11ea-8d71-362b9e155667",     
                        "platform":"",
                        "address": "",
                        "hd_path": "",
                        "created_at":""
                    }]
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
 * /web/wallets/{wallet_id}/keys:
 *   put:
 *     summary: update coins
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
 *               { items: [    
                    { "id": "",
                      "encrypted_private_key": "",
                      "platform": ""
                  }]
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
 * /web/wallets/{wallet_id}/keys/{id}:
 *   delete:
 *     summary: delete coin
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
 * /web/wallets/{wallet_id}/keys/{id}/private:
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
 * /web/wallets/{wallet_id}/coins/sort:
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
                      { "platform":"XTZ", "index": 1 },
                      { "platform":"ONE", "index": 2 },
                      { "platform":"ETH", "index": 3 },
                      { "platform":"ONT", "index": 4 },
                      { "platform":"TADA", "index": 5 },
                      { "platform":"IRIS", "index": 6 },
                      { "platform":"ONG", "index": 7 },
                      { "platform":"BTC", "index": 8 },
                      { "platform":"ATOM", "index": 9 }
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