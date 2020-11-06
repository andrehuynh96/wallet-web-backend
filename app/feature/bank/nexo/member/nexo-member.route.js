const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-member.controller');
const validator = require('app/middleware/validator.middleware');
const { create, verify } = require('./validator');
const router = express.Router();

router.post(
  '/members',
  authenticate,
  validator(create),
  controller.create
);

// router.post(
//   '/members/verify',
//   authenticate,
//   validator(verify),
//   controller.verify
// );


module.exports = router;


/*********************************************************************/


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