const express = require('express');
const controller = require('./claim.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/claim-histories',
  authenticate,
  controller.claimHistories
);

router.post(
  '/claim-reward',
  authenticate,
  // validator(create),
  controller.create
);

module.exports = router;

/*********************************************************************/



/**
 * @swagger
 * /web/membership/claim-histories:
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