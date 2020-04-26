const express = require('express');
const controller = require('./get-contract-testnet.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/erc20/tokens',
  authenticate,
  controller.get
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/erc20/tokens':
 *   get:
 *     summary: get list erc20 tokens testnet
 *     tags:
 *       - ERC20
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  
 *              "data": { 
 *                 total: 37706,
 *                 from: 0,
 *                 to: 9,
 *                 contracts:
 *                 [ {} ]
 *              }
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
