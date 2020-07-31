const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const requestSchema = require('./update-current-language.request-schema');
const controller = require('./update-current-language.controller');
const router = express.Router();

router.post(
  '/me/change-current-language',
  authenticate,
  validator(requestSchema),
  controller
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/me/change-current-language:
 *   post:
 *     summary: change current language
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
 *            - language
  *            properties:
 *              language:
 *                type: string
 *            example:
 *                  {
                      "language":"English"
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