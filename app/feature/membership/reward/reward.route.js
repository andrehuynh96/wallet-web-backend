const express = require('express');
const controller = require('./reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/rewards/available',
  authenticate,
  controller.getRewards
);

router.get(
  '/rewards/statistics',
  authenticate,
  controller.statistics
);

router.get(
  '/rewards/histories',
  authenticate,
  controller.getRewardHistories
);
module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/membership/rewards/available:
 *   get:
 *     summary: get reward current balance
 *     tags:
 *       - membership
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                "data": [
                    {
                      "currency": "ETH",
                      "amount": "250.8"
                    },
                    {
                      "currency": "USD",
                      "amount": "1323364"
                    }
                  ]
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
 * /web/membership/rewards/statistics:
 *   get:
 *     summary: get Unclaim, Payout Request, Total commission paid out
 *     tags:
 *       - membership
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                "data": [
                    {
                      "currency": "ETH",
                      "amount": "250.8"
                    },
                    {
                      "currency": "USD",
                      "amount": "1323364"
                    }
                  ]
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
 * /web/membership/rewards/histories:
 *   get:
 *     summary: get reward history
 *     tags:
 *       - membership
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
                       "id": "7",
                        "currency_symbol": "ETH",
                        "amount": "0.00001",
                        "created_at": "2020-03-27T08:36:56.308Z",
                        "updated_at": "2020-03-27T08:36:56.308Z"
                    },
                    {
                      "id": "6",
                      "currency_symbol": "ETH",
                      "amount": "5",
                      "created_at": "2020-03-27T08:36:56.308Z",
                      "updated_at": "2020-03-27T08:36:56.308Z"
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