const express = require('express');
const controller = require('./member-plutx.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/member-plutxs',
  authenticate,
  controller.getAll
);


module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs:
 *   get:
 *     summary: get member plutxs
 *     tags:
 *       - Member Plutx
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
               "data": {
                 "items": [{
                      "id": 1,
                      "member_id": "",
                      "domain_name": "",
                      "member_domain_name": "",
                      "wallet_id": "",
                      "platform": "ATOM",
                      "address": "",
                      "active_flg": true,
                      "created_at": "2020-01-07 20:22:04.728+09",
                      "updated_at": "2020-01-07 20:22:04.728+09"
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
                  }
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
