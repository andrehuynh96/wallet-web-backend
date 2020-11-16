const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./payment-method.controller');

const router = express.Router();

router.get(
  '/payment-methods',
  authenticate,
  controller
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/fiat/payment-methods:
 *   get:
 *     summary: get payment method
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
 *                     'debit-card','apple-pay'
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

