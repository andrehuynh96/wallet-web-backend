const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./tracking.controller');
const router = express.Router();
const { staking } = require('./validator');
const validator = require("app/middleware/validator.middleware");

router.post(
  '/tracking/staking',
  authenticate,
  validator(staking),
  controller.staking
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/points/tracking/staking:
 *   post:
 *     summary: calculate point staking
 *     tags:
 *       - Point
 *     description:
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data .
 *         schema:
 *            type: object
 *            example:
 *               {
                    "amount": 100,
                    "platform": "ADA",
                    "tx_id": "9730f0ea68382131dc89d6f7e19d290f2c00ac8a610f2dfb9f939ae8b469506f"
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