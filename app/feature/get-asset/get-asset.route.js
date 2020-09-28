const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./get-asset.controller');
const router = express.Router();

router.get(
  '/asset-list',
  authenticate,
  controller.getAssetList
);

module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/asset/asset-list:
 *   get:
 *     summary: currency list
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
                            "date": "2020-09-28"
                          }
                        ]
                      },
                      begin_data: 1601202386,
                      end_date: 1601115986,
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
