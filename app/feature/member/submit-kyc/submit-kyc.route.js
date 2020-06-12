const express = require("express");
const controller = require('./submit-kyc.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.post(
  '/me/kyc',
  authenticate,
  controller
);

module.exports = router;


/**
 * @swagger
 * /web/me/kyc:
 *   post:
 *     summary: post kyc
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to verify KYC.
 *         schema:
 *            example:
 *                  {

 *                  }
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data": true
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