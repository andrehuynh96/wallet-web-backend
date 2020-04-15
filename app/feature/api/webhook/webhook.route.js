const express = require("express");
const router = express.Router();
const controller = require("./webhook.controller");

router.post("/webhook/callback/:platform", controller)
module.exports = router;


/*********************************************************************/


/**
* @swagger
* /api/v1/webhook/callback/{platform}:
*   post:
*     summary: webhook callback
*     tags:
*       - API
*     description:
*     parameters:
*       - name: api-key
*         in: header
*         type: string
*       - in: body
*         name: data
*         description: Data for webhook callback.
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