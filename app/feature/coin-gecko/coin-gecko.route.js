const express = require('express');
const config = require('app/config');
const authenticate = require('app/middleware/authenticate.middleware');
const cache = require('app/middleware/cache.middleware');
const controller = require('./coin-gecko.controller');
const router = express.Router();

router.get('/coin-gecko/prices',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getPrice
);

/**
* @swagger
* /web/coin-gecko/prices:
*   get:
*     summary: get coin prices
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - in: query
*         name: platform
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data":
                    {
                      "price":5.15,
                      "usd_24h_change":5.0521196510214885
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

router.get('/coin-gecko/histories',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getHistories
);

/**
* @swagger
* /web/coin-gecko/histories:
*   get:
*     summary: get histories market range
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - in: query
*         name: platform
*         type: string
*         required: true
*       - in: query
*         name: date_type
*         type: string
*         required: true
*         description: minute | hour | day | week | month |year
*       - in: query
*         name: date_num
*         type: number
*         required: true
*         description:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "prices": [
                        [
                            1600333174946,
                            378.88608405908695
                        ],
                        [
                            1600333387672,
                            378.79051441995233
                        ],
                        [
                            1600333687747,
                            378.1992962854312
                        ],
                        [
                            1600334065468,
                            377.9722494658705
                        ],
                        [
                            1600334346669,
                            378.7690927505214
                        ]
                    ],
                    "market_caps": [
                        [
                            1600333174946,
                            42775626929.99047
                        ],
                        [
                            1600333387672,
                            42676659196.785934
                        ],
                        [
                            1600333687747,
                            42676659196.785934
                        ],
                        [
                            1600334065468,
                            42599301360.24883
                        ]
                    ],
                    "total_volumes": [
                        [
                            1600333174946,
                            14703151380.736696
                        ],
                        [
                            1600333387672,
                            12046141340.218792
                        ],
                        [
                            1600333687747,
                            14795954865.409754
                        ],
                        [
                            1600334065468,
                            14059801701.569057
                        ]
                    ]
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

router.get('/coin-gecko/token-prices',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getTokenPrice
);

/**
* @swagger
* /web/coin-gecko/token-prices:
*   get:
*     summary: get token price
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - in: query
*         name: platform
*         type: string
*         required: true
*       - in: query
*         name: contract_addresses
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "0xdac17f958d2ee523a2206206994597c13d831ec7": {
                        "usd": 0.999936,
                        "usd_24h_change": -0.02670708857383355
                    }
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

router.get('/coin-gecko/token-histories',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getTokenHistories
);

/**
* @swagger
* /web/coin-gecko/token-histories:
*   get:
*     summary: get token histories market range
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - in: query
*         name: platform
*         type: string
*         required: true
*       - in: query
*         name: contract_addresses
*         type: string
*         required: true
*       - in: query
*         name: date_type
*         type: string
*         required: true
*         description: minute | hour | day | week | month |year
*       - in: query
*         name: date_num
*         type: number
*         required: true
*         description:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "prices": [
                        [
                            1600333174946,
                            378.88608405908695
                        ],
                        [
                            1600333387672,
                            378.79051441995233
                        ],
                        [
                            1600333687747,
                            378.1992962854312
                        ],
                        [
                            1600334065468,
                            377.9722494658705
                        ],
                        [
                            1600334346669,
                            378.7690927505214
                        ]
                    ],
                    "market_caps": [
                        [
                            1600333174946,
                            42775626929.99047
                        ],
                        [
                            1600333387672,
                            42676659196.785934
                        ],
                        [
                            1600333687747,
                            42676659196.785934
                        ],
                        [
                            1600334065468,
                            42599301360.24883
                        ]
                    ],
                    "total_volumes": [
                        [
                            1600333174946,
                            14703151380.736696
                        ],
                        [
                            1600333387672,
                            12046141340.218792
                        ],
                        [
                            1600333687747,
                            14795954865.409754
                        ],
                        [
                            1600334065468,
                            14059801701.569057
                        ]
                    ]
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
module.exports = router;
