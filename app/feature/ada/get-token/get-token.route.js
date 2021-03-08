const express = require('express');
const controller = require('./get-token.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get('/ada/tokens',
  authenticate,
  controller.search
);

/*********************************************************************/

/**
 * @swagger
 * /web/ada/tokens:
 *   get:
 *     summary: get ada tokens
 *     tags:
 *       - ADA
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
 *       - name: asset_name
 *         in: query
 *         type: string
 *       - name: policy_id
 *         in: query
 *         type: string
 *       - name: address
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
                "data": [
                    {
                        "assetId": "\\xca079f39e33ca1b6ec7b4f4eedffa4f40d7d111f96bde855ba224dc2\\x444558",
                        "assetName": "DEX",
                        "quantity": "10000000",
                        "policyId": "ca079f39e33ca1b6ec7b4f4eedffa4f40d7d111f96bde855ba224dc2",
                        "transactionOutput": {
                            "address": "addr1vyml2rweurh6t7r7wsul3fe6gs9dm66vemw3y3g2q3rz9tgunflp9",
                            "index": 0,
                            "txHash": "cf4110dfdc6eb8d1cabb0965680ffc9bd302b4358f2c71c9a5f614b074e97f57",
                            "value": "9820419"
                        }
                    },
                    {
                        "assetId": "\\xca079f39e33ca1b6ec7b4f4eedffa4f40d7d111f96bde855ba224dc2\\x444558",
                        "assetName": "DEX",
                        "quantity": "10000000",
                        "policyId": "ca079f39e33ca1b6ec7b4f4eedffa4f40d7d111f96bde855ba224dc2",
                        "transactionOutput": {
                            "address": "addr1q8nd7hukgn5l0ztmkmcjama6cdjuyqp7ahdvj5hs0mtqr3rrse32hqx6qu0496alzxp76jwtjr8thfdm3mkykd7e6upqt2gt8q",
                            "index": 0,
                            "txHash": "e30c8564b8b8310aa4889640b0496217ffda41083deedb678881b94bcb9be797",
                            "value": "2000000"
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

module.exports = router;
