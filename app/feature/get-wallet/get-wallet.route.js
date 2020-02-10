const express = require('express');
const controller = require('./get-wallet.controller');
const router = express.Router();

router.get(
  '/wallets',
  controller.getAll
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/wallets?page=[page]&size=[size]:
 *   get:
 *     summary: get wallet
 *     tags:
 *       - Wallets
 *     description:
 *     parameters:
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