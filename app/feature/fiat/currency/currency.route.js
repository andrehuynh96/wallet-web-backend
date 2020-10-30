const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./currency.controller');

const router = express.Router();

router.get(
  '/currencies',
  authenticate,
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/fiat/currencies:
 *   get:
 *     summary: get fiat currency
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
                          "symbol": "USD",
                          "name": "United States Dollars",
                          "icon": "https://web-api.changelly.com/api/coins/rep.png"
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

