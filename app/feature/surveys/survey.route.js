const express = require('express');
const controller = require('./survey.controller');
const router = express.Router();

router.get(
    '/active',
    controller.getSurveys
);

module.exports = router;

/**********************************************************************/

/**
 * @swagger
 * /web/surveys/active:
 *  get:
 *      summary: get active surveys
 *      tags:
 *          - Survey
 *      description:
 *      responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
 *              "data": {
                    "id": "42ce1633-52a0-4b24-8371-439ff62b30d2",
                    "name": "survey 5",
                    "content": "test create survey",
                    "content_ja": "",
                    "start_date": "2020-11-16T04:51:40.739Z",
                    "end_date": "2020-11-20T04:51:40.739Z",
                    "description": "",
                    "point": 100,
                    "estimate_time": 60,
                    "deleted_flg": false,
                    "created_by": 32,
                    "updated_by": 32,
                    "created_at": "2020-11-18T04:52:39.884Z",
                    "updated_at": "2020-11-18T04:52:39.884Z",
                    "questions": [
                    {
                        "id": 42,
                        "title": "Are you kidding me?",
                        "title_ja": "",
                        "question_type": "OPEN_ENDED",
                        "category_type": "ANSWER_NOW",
                        "points": 0,
                        "estimate_time": 0,
                        "actived_flg": true,
                        "deleted_flg": false,
                        "created_by": 32,
                        "updated_by": 32,
                        "survey_id": "42ce1633-52a0-4b24-8371-439ff62b30d2",
                        "sub_type": "SURVEY",
                        "created_at": "2020-11-18T04:52:40.049Z",
                        "updated_at": "2020-11-18T04:52:40.049Z"
                    },
                    {
                        "id": 43,
                        "title": "question 2",
                        "title_ja": "",
                        "question_type": "OPEN_ENDED",
                        "category_type": "ANSWER_NOW",
                        "points": 0,
                        "estimate_time": 0,
                        "actived_flg": true,
                        "deleted_flg": false,
                        "created_by": 32,
                        "updated_by": 32,
                        "survey_id": "42ce1633-52a0-4b24-8371-439ff62b30d2",
                        "sub_type": "SURVEY",
                        "created_at": "2020-11-18T04:52:40.294Z",
                        "updated_at": "2020-11-18T04:52:40.294Z"
                    }
                    ]
 *               }
 *              }
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