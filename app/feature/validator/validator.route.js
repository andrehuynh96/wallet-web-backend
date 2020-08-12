const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./validator.controller');

const router = express.Router();

router.get(
  '/validators/:platform',
  authenticate,
  controller.get
);


module.exports = router;


/*********************************************************************/


/**
 * @swagger
 * /web/validators/{platform}:
 *   get:
 *     summary: validator list
 *     tags:
 *       - Validator
 *     description:
 *     parameters:
 *       - name: platform
 *         in: path
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *                 "data": {
                      [
                        {
                          id: "0076d218-08a6-42c8-be55-c4d43fa3f09d",
                          platform: "ADA",
                          address: "53215c471b7ac752e3ddf8f2c4c1e6ed111857bfaa675d5e31ce8bce",
                          created_at: "2020-07-11T04:58:12.834Z"
                        }
                      ]
 *                 }
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

