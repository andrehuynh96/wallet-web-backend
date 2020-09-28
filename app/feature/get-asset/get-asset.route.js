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
 * /web/asset/history:
 *   get:
 *     summary: history list
 *     tags:
 *       - Asset
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
