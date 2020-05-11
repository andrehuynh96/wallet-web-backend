const express = require("express");
const router = express.Router();
const controller = require("./get-member.controller");
const verifyChecksum = require('app/middleware/verify-checksum.middleware');

router.get("/members/kyc", verifyChecksum, controller)
module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /api/v1/members/kyc:
 *   get:
 *     summary: get proflie
 *     tags:
 *       - API
 *     description:
 *     parameters:
 *       - name: api-key
 *         in: header
 *         type: string
 *       - name: x-time
 *         in: header
 *         type: integer
 *         format: int32
 *       - name: x-checksum
 *         in: header
 *         type: string
 *       - name: token
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
 *                 "data":{
                        "id": "ad84f5a2-497d-11ea-b77f-2e728ce88125",
                        "email":"example@gmail.com",
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
                        "infinito_id": "",
                        "latest_login_at":"2020-02-11T16:03:09.497Z",
                        "kyc_id": "123",
                        "kyc_level": 1,
                        "kyc_status": "APPROVED"
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
