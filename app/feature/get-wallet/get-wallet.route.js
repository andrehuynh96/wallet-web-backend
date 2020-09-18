const express = require('express');
const controller = require('./get-wallet.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { sort } = require('./validator');
const router = express.Router();

router.get(
  '/wallets',
  authenticate,
  controller.getAll
);

router.get(
  '/wallets/:wallet_id/keys',
  authenticate,
  controller.get
);

router.get(
  '/wallets/:wallet_id/keys/:id',
  authenticate,
  controller.getKey
);

router.put('/wallets/sorts',
  authenticate,
  validator(sort),
  controller.saveIndex
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/wallets:
 *   get:
 *     summary: get wallet
 *     tags:
 *       - Wallets
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
 *       - name: default_flg
 *         in: query
 *         type: boolean
 *       - name: platform
 *         in: query
 *         type: string
 *       - name: token
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
                      "id": 1,
                      "name": "wallet",
                      "default_flg": false,
                      "backup_passphrase_flg": true,
                      "created_at": "2020-01-07 20:22:04.728+09"
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
 * /web/wallets/{wallet_id}/keys:
 *   get:
 *     summary: get coins of wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - name: platform
 *         in: query
 *         type: string
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
                      "id": 1,
                      "platform": "ATOM",
                      "address": "",
                      "hd_path": "",
                      "created_at": "2020-01-07 20:22:04.728+09"
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
 * /web/wallets/{wallet_id}/keys/{id}:
 *   get:
 *     summary: get key of coin
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
                  "id": 1,
                  "platform": "ATOM",
                  "address": "",
                  "hd_path": "",
                  "created_at": "2020-01-07 20:22:04.728+09"
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
 * /web/wallets/sort:
 *   put:
 *     summary: update order index of wallets
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for wallets.
 *         schema:
 *            type: array
 *            required:
 *            - items
 *            example:
 *               {
                  "items": [
                      { "wallet_id":"037198c7-6ae7-4b2e-9405-2d827f5dee02", "index": 1 },
                      { "wallet_id":"5f444da8-71c7-408d-aecd-af1b285a4bd6", "index": 2 }
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
