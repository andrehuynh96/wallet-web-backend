const express = require("express");
const controller = require('./profile.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require("app/middleware/validator.middleware");
const {unsubscribe, confirmUnsubscribe} = require("./validator");
const router = express.Router();

router.get(
  '/me',
  authenticate,
  controller.get
);
router.post(
  '/me/unsubscribe',
  authenticate,
  validator(unsubscribe),
  controller.unsubscribe
);
router.post(
  '/me/confirm-unsubscribe',
  validator(confirmUnsubscribe),
  controller.delete
);
module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/me:
 *   get:
 *     summary: get proflie
 *     tags:
 *       - Accounts
 *     description:
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                        "id": "341e6439-b918-4b9a-89cb-c6325d01f79d",
                        "email": "thangdv@blockchainlabs.asia",
                        "phone": "",
                        "twofa_enable_flg": false,
                        "twofa_download_key_flg": true,
                        "member_sts": "ACTIVATED",
                        "referral_code": "45UPFGTW",
                        "referrer_code": "",
                        "latest_login_at": "2020-03-29T10:50:23.236Z",
                        "kyc_id": "0",
                        "kyc_level": 1,
                        "kyc_status": "Approved",
                        "kyc": {
                          "1": {
                            "updateAt": "2020-03-26T10:20:34.487Z",
                            "status": "Approved",
                            "content": {
                              "kyc1": {
                                "email": "sontt@blockchainlabs.asia"
                              }
                            },
                            "expiryDate": "2023-03-27T04:28:49.681Z"
                          },
                          "2": {
                            "updateAt": "2020-03-26T10:20:49.223Z",
                            "status": "Insufficient",
                            "content": {
                              "kyc2": {
                                "phoneNumber": "0901234567"
                              }
                            }
                          },
                          "3": {
                            "updateAt": "2020-03-26T10:26:44.122Z",
                            "status": "In Review",
                            "content": {
                              "kyc3": {
                                "proofOfResidence": "1585218404031.jpeg",
                                "passport": "1585218404016.jpeg",
                                "selfieWithPassport": "1585218404028.jpeg"
                              }
                            }
                          }
                        }
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
 * /web/me/unsubscribe:
 *   post:
 *     summary: unsubscribe account
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to switch 2fa code.
 *         schema:
 *            type: object
 *            required:
 *            - twofa_code
  *            properties:
 *              twofa_code:
 *                type: string
 *            example:
 *                  {
                      "twofa_code":"613075",
                      "reasons":
                      [
                        {
                          "question":"question1",
                          "answer":"answer1"
                        }
                      ]
                    }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
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
 * /web/me/confirm-unsubscribe:
 *   post:
 *     summary: confirm unsubscribe
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to unsubscribe account with verify_token.
 *         schema:
 *            type: object
 *            required:
 *            - verify_token
  *            properties:
 *              verify_token:
 *                type: string
 *            example:
 *                  {
                        "verify_token":"NWVjZGE5ODctNzRjZS00YzkxLTgzOTMtOTBjYWNlOTQyOTBm"
 *                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": true
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