const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-member.controller');
const validator = require('app/middleware/validator.middleware');
const { create, verify, recovery_request, recovery_verify, resend_active_code } = require('./validator');
const router = express.Router();

router.post(
  '/members',
  authenticate,
  validator(create),
  controller.create
);

router.post(
  '/members/resend-active-code',
  authenticate,
  validator(resend_active_code),
  controller.resendActiveCode
);

router.post(
  '/members/verify',
  authenticate,
  validator(verify),
  controller.verify
);

router.post(
  '/members/recovery/request',
  authenticate,
  validator(recovery_request),
  controller.recoveryRequest
);

router.post(
  '/members/recovery/verify',
  authenticate,
  validator(recovery_verify),
  controller.verifyRecovery
);

router.get(
  '/members',
  authenticate,
  controller.getAccount
);

router.get(
  '/members/balance',
  authenticate,
  controller.getBalance
)

module.exports = router;


/** *******************************************************************/


/**
 * @swagger
 * /web/bank/nexo/members:
 *   post:
 *     summary: create nexo account
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - first_name
 *            - last_name
 *            example:
 *               {
                    "email":"",
                    "first_name": "",
                    "last_name": ""
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
                      "id":1,
                      "email":"",
                      "first_name": "",
                      "last_name": "",
                      "nexo_id": "5fa4bfedbcf58e63ce0d87b8",
                      "status": "UNACTIVATED/ACTIVATED",
                      "created_at": "",
                      "updated_at": ""
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
 * /web/bank/nexo/members/resend-active-code:
 *   post:
 *     summary: resend active code
 *     tags:
 *       - Bank
 *     description: Time to resend is 30 minutes
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - code
 *            example:
 *               {
 *                  "email": "thangdv@deliomart.com"
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





/**
 * @swagger
 * /web/bank/nexo/members/verify:
 *   post:
 *     summary: verify nexo account
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - code
 *            example:
 *               {
 *                  "email": "thangdv@deliomart.com",
                    "code":"41827922"
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

/**
 * @swagger
 * /web/bank/nexo/members/recovery/request:
 *   post:
 *     summary: recovery nexo account request
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            example:
 *               {
 *                  "email": "jackpercy@olympios.com",
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


/**
 * @swagger
 * /web/bank/nexo/members/recovery/verify:
 *   post:
 *     summary: verify nexo recovery account code
 *     tags:
 *       - Bank
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data.
 *         schema:
 *            type: object
 *            required:
 *            - email
 *            - code
 *            example:
 *               {
 *                  "email": "jackpercy@olympios.com",
 *                   "code": "123456"
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

/**
* @swagger
* /web/bank/nexo/members:
*   get:
*     summary: get nexo account
*     tags:
*       - Bank
*     description:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                "data": {
                       "id":"",
                       "email":"",
                       "first_name": "",
                       "last_name": "",
                       "nexo_id": "",
                       "created_at": "",
                       "updated_at": ""
                   }
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

/**
* @swagger
* /web/bank/nexo/members/balance:
*   get:
*     summary: get balance by current log in user nexo account
*     tags:
*       - Bank
*     description:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*              "data": {
*                "items": [
*                  {
                     'id': 'CLMMS5XiGXTY',
                     'name': 'LINK',
                     'currency_id':'CRjXTWuXaOf8',
                     'interest_rate': 0,
                     'interest_earned': '0.00000000',
                     'amount': '0.00000000',
                     'min_earnable': '0.3',
                     'deposit_enabled': true,
                     'withdraw_enabled': true
*                  }
*                 ]
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