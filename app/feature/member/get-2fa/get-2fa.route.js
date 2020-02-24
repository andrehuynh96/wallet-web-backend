const express = require("express");
const controller = require('./get-2fa.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/2fa',
  authenticate,
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/me/2fa:
 *   get:
 *     summary: get new secret twofa
 *     tags:
 *       - Accounts
 *     description: get new secret twofa (require user logged in)
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":"LNPGW5ZSIFUECJCBJ5OXWIKFERYEK6BDKZSHIL2YERDDUXSKKYSQ"
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
