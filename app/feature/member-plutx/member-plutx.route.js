const express = require('express');
const controller = require('./member-plutx.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const { update } = require('./validator');
const router = express.Router();

router.get(
  '/member-plutxs',
  authenticate,
  controller.getAll
);

router.post(
  '/member-plutxs',
  authenticate,
  validator(update),
  controller.update
)
router.post(
  '/member-plutxs/:domain_name/:platform',
  authenticate,
  controller.checkId
);


module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs:
 *   get:
 *     summary: get member plutxs
 *     tags:
 *       - Member Plutx
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
                  "items": [{
                      "id": 1,
                      "member_id": "",
                      "domain_name": "",
                      "member_domain_name": "",
                      "wallet_id": "",
                      "platform": "ATOM",
                      "address": "",
                      "active_flg": true,
                      "created_at": "2020-01-07 20:22:04.728+09",
                      "updated_at": "2020-01-07 20:22:04.728+09"
                    }],
                    "offset": 0,
                    "limit": 10,
                    "total": 1
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
 * /web/member-plutxs:
 *   post:
 *     summary: update member plutxs
 *     tags:
 *       - Member Plutx
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update member plutxs.
 *         schema:
 *            type: array
 *            required:
 *            - items
 *            example:
 *               { items: [
                    { "platform": "",
                    "wallet_id": ""}]
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
               "data": true
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
 * /web/member-plutxs/{domain_name}/{platform}:
 *   post:
 *     summary: check plutx id
 *     tags:
 *       - Member Plutx
 *     description:
 *     parameters:
 *       - name: domain_name
 *         in: path
 *         type: string
 *       - name: platform
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
                  "data":
                      {
                          "id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "domain_name": "a",
                          "member_id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "wallet_id": "b74b4731-106e-4abf-a0e5-f6163e5dfa14",
                          "member_domain_name": "a",
                          "platform": "a",
                          "address": "aaa",
                          "active_flg": true,
                          "created_at": "2020-04-29T08:26:25.355Z",
                          "updated_at": "2020-04-29T08:26:25.355Z"
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

/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/address:
 *   post:
 *     summary: add/edit/remove Plutx subdomain address
 *     tags:
 *       - Member Plutx
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for update Plutx subdomain address.
 *         schema:
 *            type: object
 *            required:
 *            - subdomain
 *            - crypto
 *            - walletId
 *            - action
 *            properties:
 *              subdomain:
 *                type: string
 *              crypto:
 *                type: string
 *              walletId:
 *                type: string
 *              action:
 *                type: string
 *              address:
 *                type: string
 *                enum:
 *                  - ADD_ADDRESS
 *                  - EDIT_ADDRESS
 *                  - REMOVE_ADDRESS
 *            example:
 *                  {
                      "crypto": "ETH",
                      "address": "0xaaaa",
                      "walletId": "bde582c1-f184-4ac2-9167-647d83e47091",
                      "action": "ADD_ADDRESS"
                    }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data":
                      {
                          "tx_id": ""
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

/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/get-address:
 *   get:
 *     summary: get all platform address of a Plutx subdomain
 *     tags:
 *       - Member Plutx
 *     description: get all platform address of a Plutx subdomain
 *     parameters:
 *       - name: fullDomain
 *         in: query
 *         type: string
 *         required: true
 *       - name: cryptoName
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
                  "data": {
                        "fullDomain": "000170.moonstake.io",
                        "cryptos": [
                            {
                                "address": "0x126995fb801d15fa8c31325795f924e374c941d3",
                                "cryptoName": "eth",
                                "walletId": "001291e7-cfd6-45e3-acdd-b55049329219"
                            }
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


/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/lookup:
 *   get:
 *     summary: lookup Plutx subdomain
 *     tags:
 *       - Member Plutx
 *     description: lookup Plutx subdomain
 *     parameters:
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
                  "data": [
                      {
                          "fullDomain": "google2.com",
                          "domain": "google2.com",
                          "crypto": {
                              "address": "0xf86bBfC1C09AC678D05117222eBbF76691dA6846",
                              "cryptoName": "usdt",
                              "metadata": null,
                              "defaultAddress": true,
                              "walletId": "0008b44b-47a7-4b78-bf5f-8450b7c1ded0"
                          }
                      },
                      {
                          "fullDomain": "google3.com",
                          "domain": "google3.com",
                          "crypto": {
                              "address": "0x9856165F6d09c5fbc6696d18f713Bf293584ef9E",
                              "cryptoName": "eth",
                              "metadata": null,
                              "defaultAddress": true,
                              "walletId": "1238b44b-47a7-4b78-bf5f-8450b7c1d354"
                          }
                      }
                  ]
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

/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/create-subdomain:
 *   get:
 *     summary: create Plutx subdomain
 *     tags:
 *       - Member Plutx
 *     description: create Plutx subdomain
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
                  "data":
                      {
                          "tx_id": ""
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

/*********************************************************************/

/**
 * @swagger
 * /web/member-plutxs/address:
 *   get:
 *     summary: get address by walletId and platform 
 *     tags:
 *       - Member Plutx
 *     description: get address by walletId and platform 
 *     parameters:
 *       - name: platform
 *         in: query
 *         type: string
 *       - name: walletId
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
                  "data": {
                      "id": "0008b44b-47a7-4b78-bf5f-8450b7c1ded0",
                      "platform": "ETH",
                      "address": "0xbffb4761ac8ff262c17b21f01be59c5f5eb99661",
                      "hd_path": "m/44'/60'/0'/0/0",
                      "created_at": "2020-05-01T10:14:44.854Z"
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