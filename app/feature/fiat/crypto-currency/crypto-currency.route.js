const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./crypto-currency.controller');

const router = express.Router();

router.get(
  '/crypto-currencies',
  authenticate,
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/fiat/crypto-currencies:
 *   get:
 *     summary: get crypto currency
 *     tags:
 *       - Fiat
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":[
 *                      {
 *                       "id": 1,
                          "symbol": "BTC",
                          "platform": "BTC",
                          "name": "Bitcoin",
                          "icon": "https://web-api.changelly.com/api/coins/rep.png",
                          "contract_address": "",
                          "contract_flg": true
 *                      }
 *
 *                  ]
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

