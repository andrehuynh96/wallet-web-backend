const express = require('express');
const validator = require('app/middleware/validator.middleware');
const requestSchema = require('./verify-member.request-schema');
const controller = require('./verify-member.controller');

const router = express.Router();

router.post(
  '/verify-member',
  validator(requestSchema),
  controller
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/verify-member:
 *   post:
 *     summary: Verify member
 *     tags:
 *       - Accounts
 *     description: Verify member
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data for verify.
 *         schema:
 *            type: object
 *            required:
 *            - verify_token
 *            - otp
 *            example:
 *               {
                        "verify_token":"3f76680510bcca07e7e011dcc1effb079d1d0a34",
                        "otp":"007856"
                  }
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data":{
                      "id": "ad84f5a2-497d-11ea-b77f-2e728ce88125",
                      "email":"example@gmail.com",
                      "twofa_secret":"sCM87xx",
                      "twofa_enable_flg": true,
                      "create_at":"",
                      "member_sts":"ACTIVATED",
                      "fullname":"Client",
                      "phone": "0909038232",
                      "date_of_birth": "22/09/2000",
                      "address": "123 Rood B",
                      "city": "HCM",
                      "post_code": "700000",
                      "country": "VN",
                      "referral_code": "RDFCSD4C",
                      "referrer_code": "WDRF3F1C",
                      "infinito_id": ""
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