const express = require('express');
const controller = require('./claim.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/claim/historys',
  authenticate,
  controller.getHistorys
);

router.get(
  '/claim-rewards',
  authenticate,
  controller.getClaimRewards
);

router.post(
  '/claim',
  authenticate,
  // validator(create),
  controller.create
);

module.exports = router;

/*********************************************************************/


/**
 * @swagger
 * /web/membership/claim-rewards:
 *   get:
 *     summary: get claim rewards
 *     tags:
 *       - membership
*    parameters:
 *       - name: currency_symbol
 *         in: query
 *         type: string
 *         required: true  
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
                          "id": "d6bcb267-f09c-4ead-b3dc-875d32ab8a9d",
                          "currency_symbol": "ETH",
                          "amount": "1.1",
                          "status": "PENDING",
                          "created_at": "2020-03-30T03:21:09.206Z",
                          "updated_at": "2020-03-30T03:21:09.206Z"
                        },
                        {
                          "id": "d68728cc-4553-4b95-bf4f-5eb070a1591c",
                          "currency_symbol": "ETH",
                          "amount": "1.1",
                          "status": "PENDING",
                          "created_at": "2020-03-27T08:36:56.308Z",
                          "updated_at": "2020-03-27T08:36:56.308Z"
                        },
                        {
                          "id": "2af6896f-7388-4aca-b912-7f9f7934514d",
                          "currency_symbol": "ETH",
                          "amount": "1.1",
                          "status": "PENDING",
                          "created_at": "2020-03-27T08:36:29.641Z",
                          "updated_at": "2020-03-27T08:36:29.641Z"
                        }
                      ],
                      "offset": 0,
                      "limit": 10,
                      "total": 3
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

/**
 * @swagger
 * /web/membership/claim-historys:
 *   get:
 *     summary: get claim historys
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
                       "id": "d6bcb267-f09c-4ead-b3dc-875d32ab8a9d",
                        "txid": "67",
                        "currency_symbol": "ETH",
                        "amount": "1.1",
                        "status": "PENDING",
                    },
                    {
                        "id": "d6bcb267-f09c-4ead-b3dc-875d32ab8a9d",
                        "txid": "67",
                        "currency_symbol": "ETH",
                        "amount": "1.1",
                        "status": "PENDING",
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