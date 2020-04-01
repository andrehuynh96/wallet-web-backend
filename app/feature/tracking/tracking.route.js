const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const schema = require('./tracking.request-schema');
const controller = require('./tracking.controller');
const router = express.Router();

router.post(
  '/tracking',
  authenticate,
  validator(schema),
  controller.tracking
);

router.get(
  '/tracking/history',
  authenticate,
  controller.getHis
);

router.get(
  '/tracking/:platform/:tx_id',
  authenticate,
  controller.getTxDetail
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/tracking:
 *   post:
 *     summary: tracking API
 *     tags:
 *       - Tracking
 *     description: record members' action such as send coin/token, confirm/cancel transaction
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data of action
 *         schema:
 *            type: object
 *            required:
 *            - tx_id
 *            - symbol
 *            - action
 *            example:
 *               {
                        "tx_id":"0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                        "platform":"ETH",
                        "symbol":"IFNT",
                        "amount":10,
                        "action":"SEND",
                        "send_email_flg":true,
                        "memo":"memo"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "id": "1",
                      "member_id": "fc59fa67-c05a-493b-bba5-1a1d823f1aad",
                      "tx_id": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                      "platform": "ETH",
                      "symbol": "IFNT",
                      "amount": 10,
                      "action": "SEND",
                      "send_email_flg": true,
                      "memo": "memo",
                      "updatedAt": "2020-03-26T14:43:55.174Z",
                      "createdAt": "2020-03-26T14:43:55.174Z"
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

/*********************************************************************/


/**
 * @swagger
 * /web/tracking/history:
 *   get:
 *     summary: get transaction history
 *     tags:
 *       - Tracking
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
 *       - name: platform
 *         in: query
 *         type: string
 *       - name: tx_id
 *         in: query
 *         type: string
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
                              "tx_id": "0x825131d19407748d576509f148bcec203313577b7220c3110d1f414b81469c11",
                              "platform": "ETH",
                              "symbol": "ETH",
                              "amount": 0.0005,
                              "action": "SEND",
                              "memo": ""
                          },
                          {
                              "tx_id": "0xa406d485ea33241bcf91590da4023b841155d1e15894ccce3c82739a3f6a37b5",
                              "platform": "ETH",
                              "symbol": "ETH",
                              "amount": 0.0003,
                              "action": "SEND",
                              "memo": ""
                          }
                      ],
                      "offset": 0,
                      "limit": 2,
                      "total": 18
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

/*********************************************************************/


/**
 * @swagger
 * /web/tracking/{platform}/{tx_id}:
 *   get:
 *     summary: get transaction detail
 *     tags:
 *       - Tracking
 *     description: get one transaction detail based on platform and tx_id
 *     parameters:
 *       - name: platform
 *         in: path
 *         type: string
 *       - name: tx_id
 *         in: path
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      "tx_id": "530D7E3F7E6FB305805D83744B739D6CF5A224073C3E1EB01AF0A4EF6E0A8FF8",
                      "platform": "IRIS",
                      "symbol": "IRIS",
                      "amount": 3,
                      "action": "SEND",
                      "memo": "a"
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
