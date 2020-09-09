const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const { create, update } = require('./validator');
const controller = require('./wallet.controller');
const authority = require('app/middleware/authority.middleware');
const Permission = require('app/model/wallet/value-object/permission-key');

const router = express.Router();

router.post(
  '/wallets',
  authenticate,
  authority(Permission.GENERATE_WALLET), 
  validator(create),
  controller.create
);

router.put(
  '/wallets/:id',
  authenticate,
  validator(update),
  controller.update
);

router.delete(
  '/wallets/:id',
  authenticate,
  controller.delete
);

router.get(
  '/wallets/:wallet_id/passphrase',
  authenticate,
  controller.getPassphrase
);

router.get(
  '/wallets/confirm',
  authenticate,
  controller.confirm
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/wallets:
 *   post:
 *     summary: create / import wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            required:
 *            - encrypted_passphrase
 *            example:
 *               {     
                    "encrypted_passphrase": "",
                    "name": "thangdv",
                    "default_flg": true,
                    "backup_passphrase_flg": true
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
                        "name": "thangdv",     
                        "default_flg":true,
                        "backup_passphrase_flg": true,
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
 */

 /**
 * @swagger
 * /web/wallets/{id}:
 *   put:
 *     summary: update wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: data
 *         description: Data for wallet.
 *         schema:
 *            type: object
 *            example:
 *               {     
 *                  "name": "wallet",
                    "default_flg": true,
                    "encrypted_passphrase": "",
                    "backup_passphrase_flg": true
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
                        "name": "wallet",     
                        "default_flg":true,
                        "backup_passphrase_flg": true,
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
 *     summary: delete wallet
 *     tags:
 *       - Wallets
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
 *                 "data":true
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
 * /web/wallets/{wallet_id}/passphrase:
 *   get:
 *     summary: get encrypted passphrase
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: path
 *         name: wallet_id
 *         type: string
 *         required: true
 *       - in: query
 *         name: twofa_code
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                        "encrypted_passphrase": ""
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
 * /web/wallets/confirm:
 *   get:
 *     summary: confirm delete wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
 *                    deleted: true,
 *                    wallet_name: "ABC"
 *                  }
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

