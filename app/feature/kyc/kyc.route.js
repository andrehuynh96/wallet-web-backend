const express = require('express');
const controller = require('./kyc.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/kyc/permissions',
  authenticate,
  controller.get
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/kyc/permissions:
 *   get:
 *     summary: get kyc permissions
 *     tags:
 *       - Kyc
 *     description:
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {  
               "data": ["GENERATE_WALLET", "IMPORT_WALLET"]
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