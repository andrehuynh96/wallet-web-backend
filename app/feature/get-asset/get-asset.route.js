const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./get-asset.controller');
const router = express.Router();

router.get(
  '/asset-list',
  authenticate,
  controller.getAssetList
);

router.get(
  '/history',
  authenticate,
  controller.getAssetHistory
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/asset/history:
 *   get:
 *     summary: history list
 *     tags:
 *       - Asset
 *     description:
 *     parameters:
 *       - name: platform
 *         in: query
 *         type: string
 *         format: string
 *       - name: offset
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *       - name: wallet_id
 *         in: query
 *         type: string
 *         format: uuid
*       - name: sort
 *         in: query
 *         type: string
 *         enum: ['asc', 'desc']
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
                          "symbol":"IRIS",
                          "reward": 18,
                          "staked": 20,
                          "create_at": "2020-09-23 17:00"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 1
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

/**
* @swagger
* /web/asset/asset-list:
*   get:
*     summary: asset list
*     tags:
*       - Asset
*     description:
*     parameters:
*       - name: platform
*         in: query
*         type: string
*         format: string
*       - name: type
*         in: query
*         type: string
*         enum: ['all', 'day', 'week', 'month', 'year']
*       - name: wallet_id
*         in: query
*         type: string
*         format: uuid
*       - name: sort
*         in: query
*         type: string
*         enum: ['asc', 'desc']
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": {
                     "items": {
                       "ATOM": [
                         {
                           "reward": 18,
                           "staked": 20,
                           "date": "2020-40"
                         }
                       ]
                     },
                     begin_data: "2020-09-18 00:00:00.00+09",
                     end_date: "2020-09-24 00:00:00.00+09",
                     type: "WEEK"
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
