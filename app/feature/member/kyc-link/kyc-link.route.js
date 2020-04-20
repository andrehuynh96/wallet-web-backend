const express = require("express");
const controller = require('./kyc-link.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/kyc-link',
  authenticate,
  controller
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/me/kyc-link:
 *   get:
 *     summary: get kyc link
 *     tags:
 *       - Accounts
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
 *                 "data": "http://kyc.com/?token=YmU4MjlhM2EtYWMyMi00MGJjLWIyMzUtMDJkOTBhZTU5OTlj"
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


/*********************************************************************/