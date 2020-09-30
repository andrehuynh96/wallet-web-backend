const express = require("express");
const controller = require('./member-setting.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./member-setting.request-schema');
const router = express.Router();

router.get(
  '/member-settings/:memberId',
   authenticate,
  controller.get
);
module.exports = router;

router.put(
  '/member-settings/:memberId',
  authenticate,
  validator(requestSchema),
  controller.update
);
module.exports = router;


/** *******************************************************************/

/**
 * @swagger
 * /web/member-settings/{memberId}:
 *   get:
 *     summary: Get member setting
 *     tags:
 *       - Setting
 *     description: Get member setting
 *     parameters:
 *       - name: memberId
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
  *       "data": {
  *           "member_id": "a87548d2-6275-4001-a0b8-20752f178710",
  *           "is_receiced_system_notification_flg": true,
  *            "is_receiced_activity_notification_flg": true,
  *            "is_receiced_news_notification_flg": true,
  *            "is_receiced_marketing_notification_flg": true,
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
* /web/member-settings/{memberId}:
*   put:
*     summary: update member setting
*     tags:
*       - Setting
*     description: update member setting
*     parameters:
*       - name: memberId
*         in: query
*         type: integer
*         format: int32
*       - in: body
*         name: data
*         description: Data submit for update member setting.
*         schema:
*            type: object
*            example:
*             {
*                	"is_receiced_system_notification_flg": false,
*                  "is_receiced_activity_notification_flg": false,
*                  "is_receiced_news_notification_flg": false,
*                  "is_receiced_marketing_notification_flg": true
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
