const express = require('express');
const config = require('app/config');
const authenticate = require('app/middleware/authenticate.middleware');
const cache = require('app/middleware/cache.middleware');
const controller = require('./coin.controller');
const router = express.Router();

router.get('/prices',
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

router.get('/histories',
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

router.get('/multi-prices',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getMultiPrice
);

/**
* @swagger
* /web/coin-gecko/multi-prices:
*   get:
*     summary: get multi coin prices
*     tags:
*       - Coin Gecko
*     description:
*     parameters:
*       - in: query
*         name: platforms
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
                "data": {
                    "gas": {
                        "usd": 1.64,
                        "usd_24h_change": 1.329113946915967
                    },
                    "cardano": {
                        "usd": 0.08628,
                        "usd_24h_change": 10.721321253927602
                    },
                    "qtum": {
                        "usd": 2.28,
                        "usd_24h_change": 4.031394688213249
                    },
                    "ethereum": {
                        "usd": 343.87,
                        "usd_24h_change": 6.0063639865603164
                    },
                    "eos": {
                        "usd": 2.52,
                        "usd_24h_change": 2.7459988830385207
                    },
                    "neo": {
                        "usd": 22.73,
                        "usd_24h_change": 12.483676728286445
                    },
                    "bitcoin": {
                        "usd": 10689.01,
                        "usd_24h_change": 3.8338274610288865
                    },
                    "harmony": {
                        "usd": 0.00509215,
                        "usd_24h_change": 8.037133356696074
                    },
                    "tezos": {
                        "usd": 2.16,
                        "usd_24h_change": 7.065228781610871
                    },
                    "tomochain": {
                        "usd": 0.884278,
                        "usd_24h_change": 8.935711808116586
                    },
                    "v-systems": {
                        "usd": 0.01875572,
                        "usd_24h_change": 3.614422240918748
                    },
                    "binancecoin": {
                        "usd": 24.46,
                        "usd_24h_change": 5.340935685302037
                    },
                    "ong": {
                        "usd": 0.1171,
                        "usd_24h_change": 3.5388923703448505
                    },
                    "ontology": {
                        "usd": 0.641535,
                        "usd_24h_change": 7.753945608327552
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

module.exports = router;

