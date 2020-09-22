const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./update-transaction.controller');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./update-transaction.request-schema');
const router = express.Router();

router.put(
  '/transactions/:id',
  authenticate,
  validator(requestSchema),
  controller
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/exchange/transactions/{id}:
 *   put:
 *     summary: update tx_id
 *     tags:
 *       - Exchange
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            example:
 *               {
                      "tx_id": "0xd8de614b6cbf4acecaa47536fb34e90eb33bf39c2a440329ab9774d82f54422f"
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

