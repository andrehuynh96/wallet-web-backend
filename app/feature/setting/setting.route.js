const express = require("express");
const controller = require('./setting.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/settings/expire-vefiry-token',
  authenticate,
  controller.expiredVefiryToken
);
module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/expire-vefiry-token:
 *   get:
 *     summary: Get expire vefiry token
 *     tags:
 *       - Setting
 *     description: Get expire vefiry token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": 1
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
