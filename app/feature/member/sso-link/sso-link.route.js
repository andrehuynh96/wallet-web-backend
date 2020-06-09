const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./sso-link.controller');

const router = express.Router();

router.post(
  '/me/sso-link',
  authenticate,
  controller
);

module.exports = router;

/** *******************************************************************/

/**
 * @swagger
 * /web/me/sso-link:
 *   post:
 *     summary: Create a SSO link for Membership site
 *     tags:
 *       - Accounts
 *     description:
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: submit data.
 *         schema:
 *            type: object
 *            required:
 *            - password
 *            - new_password
  *            properties:
 *              password:
 *                type: string
 *              new_password:
 *                type: string
 *            example:
 *                  {
                          "password":"Abc123456",
                          "new_password":"123Abc123456",
                          "g-recaptcha-response":"fdsfdsjkljfsdfjdsfdhs"
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
