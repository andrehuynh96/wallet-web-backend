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
*     summary: get kyc schema properties
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
                "data": 0.00597856
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
*     summary: get kyc schema properties
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
*         description: valid date_type belong time unit
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
