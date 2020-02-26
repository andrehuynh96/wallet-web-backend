const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./staking-platform.controller');

const router = express.Router();

router.get(
  '/staking-platforms',
  authenticate,
  controller.getAll
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/staking-platforms:
 *   get:
 *     summary: search platform
 *     tags:
 *       - Staking Platform
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
 *                 "data": {
                      "items": [
                        {
                          "id":"96b7f440-1a3b-11ea-978f-2e728ce88125",
                          "name":"Ethereum",
                          "symbol":"ETH",
                          "icon":"https://static.chainservices.info/staking/platforms/eth.png",
                          "description":"AWS token",
                          "order_index":99,
                          "staking_type":"CONTRACT",
                          "sc_lookup_addr":"0x1716a6f9D3917966d934Ce7837113A30dFFda9F4",
                          "sc_token_address":"0x423822D571Bb697dDD993c04B507dD40E754cF05",
                          "created_at":"2020-01-13T06:47:41.248Z",
                          "updated_at":"2020-01-13T06:47:41.248Z"
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

