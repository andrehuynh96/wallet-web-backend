const express = require("express");
const controller = require('./list-referral.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/referrals',
  authenticate,
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/me/referrals:
 *   get:
 *     summary: get accepted invitees
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
                "data": {
                  "items": [
                    {
                      "ext_client_id": "huyht+1116@blockchainlabs.asia",
                      "created_at": "2020-05-14T08:58:45.940Z",
                      "updated_at": "2020-05-14T08:58:45.940Z"
                    },
                    {
                      "ext_client_id": "huyht+1114@blockchainlabs.asia",
                      "created_at": "2020-05-14T08:57:42.748Z",
                      "updated_at": "2020-05-14T08:57:42.748Z"
                    },
                    {
                      "ext_client_id": "huyht+1113@blockchainlabs.asia",
                      "created_at": "2020-05-14T08:54:07.350Z",
                      "updated_at": "2020-05-14T08:54:07.350Z"
                    },
                    {
                      "ext_client_id": "huyht+1112@blockchainlabs.asia",
                      "created_at": "2020-05-14T08:50:34.675Z",
                      "updated_at": "2020-05-14T08:50:34.675Z"
                    },
                    {
                      "ext_client_id": "huyht+1111@blockchainlabs.asia",
                      "created_at": "2020-05-14T08:47:54.286Z",
                      "updated_at": "2020-05-14T08:47:54.286Z"
                    }
                  ],
                  "offset": 0,
                  "limit": 10,
                  "total": 5
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