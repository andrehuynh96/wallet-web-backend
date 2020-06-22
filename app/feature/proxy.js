const express = require("express");
const router = express.Router();
const authenticate = require('app/middleware/authenticate.middleware');
const config = require("app/config");

module.exports = function (proxy) {
  router.post(
    '/me/kyc',
    authenticate,
    (req, res, next) => {
      let target = `${config.kyc.baseUrl}/api/kycs/me/customers/${req.user.kyc_id}/submit`;
      req.url = target;
      proxy.web(req, res, {
        secure: false,
      });
    }
  );
  return router;
}


/**
 * @swagger
 * /web/me/kyc:
 *   post:
 *     summary: post kyc
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data JSON to verify KYC.
 *         schema:
 *            example:
 *                  {

 *                  }
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