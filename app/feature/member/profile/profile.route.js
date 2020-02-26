const express = require("express");
const controller = require('./profile.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me',
  authenticate,
  controller.get
);
router.post(
  '/me/unsubcribe',
  authenticate,
  controller.unsubcribe
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
 *     parameters:
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
