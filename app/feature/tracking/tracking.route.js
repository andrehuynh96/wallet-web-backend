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
  controller
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
