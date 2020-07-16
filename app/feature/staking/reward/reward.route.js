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
  controller.getRewardHistorys
);

module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/staking/rewards/available:
 *   get:
 *     summary: get reward current balance
 *     tags:
 *       - staking reward
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
 * /web/staking/rewards/statistics:
 *   get:
 *     summary: get Unclaim, Payout Request, Total commission paid out
 *     tags:
 *       - staking reward
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
                      "currency_symbol": "ATOM",
                      "reward_list": [
                        {
                          "level": 0,
                          "amount": 0,
                          "membership_policy": {
                            "proportion_share": 10,
                            "membership_rate": {
                              "d146bc01-9e56-4664-9788-79e518877f0b": 20,
                              "88fda933-0658-49c4-a9c7-4c0021e9a071": 100
                            }
                          }
                        },
                        {
                          "level": 1,
                          "amount": 0
                        },
                        {
                          "level": 2,
                          "amount": 0
                        },
                        {
                          "level": 3,
                          "amount": 0
                        },
                        {
                          "level": 4,
                          "amount": 0
                        }
                      ],
                      "total_amount": 0,
                      "available_amount": 0,
                      "pending_amount": 0,
                      "paid_amount": 0
                    },
                    {
                      "currency_symbol": "IRIS",
                      "reward_list": [
                        {
                          "level": 0,
                          "amount": 0,
                          "membership_policy": {
                            "proportion_share": 10,
                            "membership_rate": {
                              "d146bc01-9e56-4664-9788-79e518877f0b": 20,
                              "88fda933-0658-49c4-a9c7-4c0021e9a071": 100
                            }
                          }
                        },
                        {
                          "level": 1,
                          "amount": 0
                        },
                        {
                          "level": 2,
                          "amount": 0
                        },
                        {
                          "level": 3,
                          "amount": 0
                        },
                        {
                          "level": 4,
                          "amount": 0
                        }
                      ],
                      "total_amount": 0,
                      "available_amount": 0,
                      "pending_amount": 0,
                      "paid_amount": 0
                    },
                    {
                      "currency_symbol": "ONG",
                      "reward_list": [
                        {
                          "level": 0,
                          "amount": 0,
                          "membership_policy": {
                            "proportion_share": 10,
                            "membership_rate": {
                              "d146bc01-9e56-4664-9788-79e518877f0b": 20,
                              "88fda933-0658-49c4-a9c7-4c0021e9a071": 100
                            }
                          }
                        },
                        {
                          "level": 1,
                          "amount": 0
                        },
                        {
                          "level": 2,
                          "amount": 0
                        },
                        {
                          "level": 3,
                          "amount": 0
                        },
                        {
                          "level": 4,
                          "amount": 0
                        }
                      ],
                      "total_amount": 0,
                      "available_amount": 0,
                      "pending_amount": 0,
                      "paid_amount": 0
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
 * /web/staking/rewards/histories:
 *   get:
 *     summary: get reward history
 *     tags:
 *       - staking reward
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