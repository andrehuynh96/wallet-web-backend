const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-deposit.controller');
const validator = require('app/middleware/validator.middleware');
const { track } = require('./validator');
const router = express.Router();

router.get(
  '/deposit/:nexo_id/:currency_id',
  authenticate,
  controller.get
);

router.post(
  '/deposit/transactions/track',
  authenticate,
  validator(track),
  controller.track
);


module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /web/bank/nexo/deposit/{nexo_id}/{currency_id}:
 *   get:
 *     summary: get deposit information
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: path
 *         name: nexo_id
 *         type: string
 *         required: true
 *       - in: path
 *         name: currency_id
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
                    status: 'ready',
                    address: '2N8TDLdRi77SdnRYEcjPyPtyReL3Lq5w6YA',
                    tag: null,
                    short_name: 'BTC'
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
 * /web/bank/nexo/deposit/transactions/track:
 *   post:
 *     summary: tracking deposit
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - nexo_member_id
 *            - platform
 *            - nexo_currency_id
 *            - nexo_id
 *            example:
 *               {
 *                  "nexo_member_id": "",
                    "platform":"ETH",
                    "nexo_currency_id": "",
                    "nexo_id": "",
                    "wallet_id": "",
                    "amount": 0,
                    "total_fee": 0,
                    "address": "",
                    "memo": "",
                    "short_name": "",
                    "tx_id": "",
                    "response": ""
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
