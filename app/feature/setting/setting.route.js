const express = require("express");
const controller = require('./setting.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/settings/expire-verify-token',
  authenticate,
  controller.expiredVerifyToken
);
module.exports = router;




/*********************************************************************/

/**
 * @swagger
 * /web/settings/expire-verify-token:
 *   get:
 *     summary: Get expire verify token
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
