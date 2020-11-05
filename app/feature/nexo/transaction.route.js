const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./transaction.controller');
const router = express.Router();

router.get(
    '/transactions/:id',
    authenticate,
    controller.getTxById
)

router.get(
    '/transactions',
    authenticate,
    controller.getTxs
)

module.exports = router;
/**********************************************************************/

/**
 * @swagger
 * /web/nexo/transactions/{id}:
 *   get:
 *     summary: get nexo transaction by id
 *     tags:
 *       - Nexo
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
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
 *                 "data": {
                        "id": "id",
                        "wallet_id": "wallet_id",
                        "nexo_member_id": "nexo_member_id",
                        "nexo_id": "nexo_id",
                        "type": "type",
                        "platform": "platform",
                        "nexo_currency_id": "nexo_currency_id",
                        "amount": "amount",
                        "total_fee": "total_fee",
                        "address": "address",
                        "memo": "memo",
                        "short_name": "short_name",
                        "tx_id": "tx_id",
                        "status": "status",
                        "response": "response",
                        "device_code": "device_code",
                        "createdAt": "createdAt",
                        "updatedAt": "updatedAt"
 *                  }
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
 * /web/nexo/transactions:
 *   get:
 *     summary: get nexo transaction by current log in user
 *     tags:
 *       - Nexo
 *     description:
  *     parameters:
 *       - in: query
 *         name: offset
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: limit
 *         type: integer
 *         format: int32
 *       - in: query
 *         name: sort_field
 *         type: string
 *       - in: query
 *         name: sort_by
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *              "data": {
 *                "items": [
 *                  {
                        "id": "id",
                        "wallet_id": "wallet_id",
                        "nexo_member_id": "nexo_member_id",
                        "nexo_id": "nexo_id",
                        "type": "type",
                        "platform": "platform",
                        "nexo_currency_id": "nexo_currency_id",
                        "amount": "amount",
                        "total_fee": "total_fee",
                        "address": "address",
                        "memo": "memo",
                        "short_name": "short_name",
                        "tx_id": "tx_id",
                        "status": "status",
                        "response": "response",
                        "device_code": "device_code",
                        "createdAt": "createdAt",
                        "updatedAt": "updatedAt"
 *                  }
 *                 ],
 *                 "offset": 0,
 *                 "limit": 10,
 *                 "total": 1
 *               }
 *              }
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