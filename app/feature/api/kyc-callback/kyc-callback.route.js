const express = require("express");
const router = express.Router();
const controller = require("./kyc-callback.controller");
const callbackAuthenticate = require('app/middleware/callback-authenticate.middleware');

router.post("/kycs/callback", callbackAuthenticate, controller)
module.exports = router;


/*********************************************************************/


/**
* @swagger
* /api/v1/kycs/callback:
*   post:
*     summary: callback
*     tags:
*       - API
*     description:
*     parameters:
*       - name: api-key
*         in: header
*         type: string
*       - in: body
*         name: data
*         description: Data for callback.
*         schema:
*            type: object
*            example:
*               {
                       event,
                       customer: {
                           id: customer._id,
                           email: customer.email
                       },
                       kyc: {
                           name,
                           type: customer.type,
                           level,
                           status: customer.level.status
                       }
                 }
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":true

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