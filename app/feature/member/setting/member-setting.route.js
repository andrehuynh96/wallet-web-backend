const express = require("express");
const controller = require('./member-setting.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./member-setting.request-schema');
const router = express.Router();

router.get(
  '/me/setting',
  authenticate,
  controller.get
);

router.put(
  '/me/setting',
  authenticate,
  validator(requestSchema),
  controller.update
);
module.exports = router;


/** *******************************************************************/

/**
 * @swagger
 * /web/me/setting:
 *   get:
 *     summary: Get member setting
 *     tags:
 *       - Accounts
 *     description: Get member setting
 *     parameters:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
  *       "data": {
  *            "member_id": "a87548d2-6275-4001-a0b8-20752f178710",
  *            "is_allow_message_flg": true,
  *            "created_at": "2020-09-29T06:13:21.033Z",
  *            "updated_at": "2020-09-29T06:13:21.033Z"
  *       }
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
* /web/me/setting:
*   put:
*     summary: update member setting
*     tags:
*       - Accounts
*     description: update member setting
*     parameters:
*       - in: body
*         name: data
*         description: Data submit for update member setting.
*         schema:
*            type: object
*            example:
*             {
*                "is_allow_message_flg": false
*             }
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
