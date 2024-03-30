const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./polkadot.controller');
const router = express.Router();

router.get(
  '/rewards/:address',
  // authenticate,
  controller.reward
)


module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /web/polkadot/rewards/{address}:
 *   get:
 *     summary: polkadot reward
 *     tags:
 *       - Polkadot
 *     description:
 *     parameters:
 *       - name: address
 *         in: path
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
                      "reward": 1646681065,
                      "eras": [
                        {
                          "era": 3227,
                          "rewards": [
                            {
                              "validator":"5DZnA1rgTeyV1NT1EiDKUExB2khXNZkmD2VYcnYb9zEEJUbX",
                              "value":1646681065
                            }
                          ]
                        }
                      ],
 *                 }
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