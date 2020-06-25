const express = require('express');
const controller = require('./referral.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.post(
  '/referral/invitation',
  authenticate,
  controller.invite
);


module.exports = router;


/*********************************************************************/

/**
 * @swagger
 * /web/membership/referral/invitation:
 *   post:
 *     summary: invitation 
 *     tags:
 *       - membership
 *     description: Send email invitation link 
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data submit.
 *         schema:
 *            type: object
 *            example:
 *               {
                      "emails": 'thangdv@blockchainlabs.asia, huyht@blockchainlabs.asia'
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