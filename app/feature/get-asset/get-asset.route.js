const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./get-asset.controller');
const validator = require('app/middleware/validator.middleware');
const { filter } = require('./validator');

const router = express.Router();

router.post(
  '/asset-list',
  authenticate,
  validator(filter),
  controller.getAssetList
);

router.post(
  '/total-asset-list',
  authenticate,
  validator(filter),
  controller.getTotalAssetList
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/asset/total-asset-list:
 *   post:
 *     summary: currency list
 *     tags:
 *       - Asset list
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
 *       - name: platform
 *         in: query
 *         type: string
 *         format: string
 *       - name: filter
 *         in: query
 *         type: string
 *         enum: ['all', 'day', 'week', 'month', 'year']
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
                          "reward": 18,
                          "staked": 20,
                          "sort": "2020-09-23 17:00"
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
 *   post:
 *     summary: currency list
 *     tags:
 *       - Asset list
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
 *       - name: platform
 *         in: query
 *         type: string
 *         format: string
 *       - name: filter
 *         in: query
 *         type: string
 *         enum: ['all', 'day', 'week', 'month', 'year']
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
                          "symbol":"ATOM",
                          "reward": 18,
                          "staked": 20,
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
