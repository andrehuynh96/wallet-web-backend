const express = require("express");
const controller = require('./term-condition.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/term-condition',
  authenticate,
  controller.get
);

router.post(
  '/term-condition/:id',
  authenticate,
  controller.set
);

module.exports = router;



/*********************************************************************/

/**
 * @swagger
 * /web/term-condition:
 *   get:
 *     summary: Get term and condition
 *     tags:
 *       - Term Condition
 *     description: Get term and condition
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                            "id": 1,
                            "term_no": "GKU1I3T0",
                            "content": "ABC123",
                            "applied_date": "2020-08-20T08:01:03.569Z"
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
 * /web/term-condition/{id}:
 *   post:
 *     summary: update 2fa download key
 *     tags:
 *       - Term Condition
 *     description:
 *     parameters:
 *       - in: path
 *         name: id
 *         require: true
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