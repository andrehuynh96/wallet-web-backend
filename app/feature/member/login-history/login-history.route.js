const express = require("express");
const controller = require('./login-history.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/login-history',
  authenticate,
  controller
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/me/login-history:
 *   get:
 *     summary: search login history
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "items": [
                        {
                          "user_id":1,
                          "client_ip":"192.168.0.1",
                          "action":"LOGIN",
                          "user_agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
                          "data":"",
                          "createdAt":"2020-01-13T06:47:41.248Z",
                          "updatedAt":"2020-01-13T06:47:41.248Z"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 4
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


/*********************************************************************/


