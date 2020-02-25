const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create} = require('./validator');
const controller = require('./wallet-private-key.controller');

const router = express.Router();

router.post(
  '/wallets/:wallet_id/keys',
  authenticate,
  validator(create),
  controller.create
);

router.delete(
  '/wallets/:wallet_id/keys/:id',
  authenticate,
  controller.delete
);

router.get(
  '/wallets/:wallet_id/keys/:id/private',
  authenticate,
  controller.getPrivKey
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
 *            - password_hash
 *            example:
 *               { items: [    
                    { "private_key_hash": "",
                    "platform": "",
                    "address": "",
                    "hd_path": ""}],
                  password_hash: ""
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
                        "platform":false,
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
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            required:
 *            - password_hash
 *            example:
 *               {   
 *                  "password_hash": ""
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
 *   get:
 *     summary: get private key hash
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
 *       - in: query
 *         name: password_hash
 *         type: string
 *         required: true
 *       - in: query
 *         name: twofa_code
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
                        "private_key_hash": ""
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