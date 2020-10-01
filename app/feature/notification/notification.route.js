const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./notification.controller');

const router = express.Router();

router.get(
    '/notification',
    authenticate,
    controller.getAll
);

router.get(
    '/notification/:message_id',
    authenticate,
    controller.getMessage
);

router.put(
    '/notification/delete',
    authenticate,
    controller.deleteMessage
);

router.put(
    '/notification/read',
    authenticate,
    controller.markReadMessage
);

router.get(
    '/notification/unread/count',
    authenticate,
    controller.countUnreadMessage
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/notification:
 *   get:
 *     summary: notification list of user by filter
 *     tags:
 *       - Notification
 *     description:
 *     parameters:
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *       - name: filter
 *         in: query
 *         type: string
 *         description: should be all, read, unread. all is default if null
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
                          "id": 6,
                          "description": "やあ！すずきちゃ",
                          "type": "SYSTEM",
                          "event": "NEW_INFORMATION",
                          "read_flg": false,
                          "created_at": "2020-09-28T09:04:39.821Z",
                          "updated_at": "2020-09-28T09:04:39.821Z",
                          "title": "FOO title JA2020-09-28 17:57:49.181112+09",
                          "content": "こんにちは2020-09-28 17:57:49.181112+09"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 100
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

/**
* @swagger
* /web/notification/{message_id}:
*   get:
*     summary: notification detail of user by id
*     tags:
*       - Notification
*     description:
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": {
                    "id": 3,
                    "description": "やあ！すずきちゃ",
                    "type": "SYSTEM",
                    "event": "NEW_INFORMATION",
                    "read_flg": false,
                    "created_at": "2020-09-28T09:04:34.117Z",
                    "updated_at": "2020-09-28T09:04:34.117Z",
                    "title": "FOO title JA2020-09-28 17:57:45.70184+09",
                    "content": "こんにちは2020-09-28 17:57:45.70184+09"
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

/**
 * @swagger
 * /web/notification/unread/count:
 *   get:
 *     summary: return total unread notification of user
 *     tags:
 *       - Notification
 *     description:
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": 122
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
 * /web/notification/delete:
 *   put:
 *     summary: delete notification of user by list of id
 *     tags:
 *       - Notification
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: message_ids is optional value, delete all if null or empty
 *         schema:
 *            type: object
 *            required:
 *            example:
 *                {
                      "message_ids":[1,2,3]
                  }
 *     produces:
 *       - application/json
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


/*********************************************************************/

/**
 * @swagger
 * /web/notification/read:
 *   put:
 *     summary: mark read status of notification by list of id
 *     tags:
 *       - Notification
 *     description: 
 *     parameters:
 *       - in: body
 *         name: data
 *         description: message_ids is optional value, select all if null or empty
 *         schema:
 *            type: object
 *            required:
 *            example:
 *                {
                      "message_ids":[1,2,3]
                  }
 *     produces:
 *       - application/json
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