const express = require('express');
const controller = require('./member-plutx.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { update, updatePlutxAddress } = require('./validator');
const router = express.Router();

router.get(
  '/member-plutxs',
  authenticate,
  controller.getAll
);

router.post(
  '/member-plutxs',
  authenticate,
  validator(update),
  controller.update
)
router.post(
  '/member-plutxs/:domain_name/:platform',
  authenticate,
  controller.checkId
);

router.post(
  '/member-plutxs/get-admin-sig/:crypto',
  authenticate,
  controller.getDomainAdminSigature
)

router.post(
  '/member-plutxs/address',
  authenticate,
  validator(updatePlutxAddress),
  controller.updatePlutxAddress
)

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

/**
 * @swagger
 * /web/member-plutxs:
 *   post:
 *     summary: update member plutxs
 *     tags:
 *       - Member Plutx
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update member plutxs.
 *         schema:
 *            type: array
 *            required:
 *            - items
 *            example:
 *               { items: [
                    { "platform": "",
                    "wallet_id": ""}]
                  }
 *     produces:
 *       - application/json
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

/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/{domain_name}/{platform}:
 *   post:
 *     summary: check plutx id
 *     tags:
 *       - Member Plutx
 *     description:
 *     parameters:
 *       - name: domain_name
 *         in: path
 *         type: string
 *       - name: platform
 *         in: path
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data":
                      {
                          "id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "domain_name": "a",
                          "member_id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "wallet_id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "member_domain_name": "a",
                          "platform": "a",
                          "address": "aaa",
                          "active_flg": true,
                          "created_at": "2020-04-29T08:26:25.355Z",
                          "updated_at": "2020-04-29T08:26:25.355Z"
                      }
              }
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
