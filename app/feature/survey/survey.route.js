const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./survey.controller');
const router = express.Router();


router.get(
  '/active',
  authenticate,
  controller.getInProcessSurvey
);

module.exports = router;

/** ********************************************************************/

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
                    "content": "",
                    "start_date": "2020-11-16T04:51:40.739Z",
                    "end_date": "2020-11-20T04:51:40.739Z",
                    "description": "",
                    "point": 100,
                    "estimate_time": 60,
                    "created_at": "2020-11-18T04:52:39.884Z",
                    "updated_at": "2020-11-18T04:52:39.884Z",
                    "questions": [
                    {
                        "id": 42,
                        "title": "",
                        "question_type": "OPEN_ENDED",
                        "category_type": "ANSWER_NOW",
                        "points": 0,
                        "estimate_time": 0,
                        "survey_id": "42ce1633-52a0-4b24-8371-439ff62b30d2",
                        "sub_type": "SURVEY",
                        "created_at": "2020-11-18T04:52:40.049Z",
                        "updated_at": "2020-11-18T04:52:40.049Z",
                        "answers": [
                        {
                            "id": 157,
                            "question_id": 42,
                            "text": "",
                            "created_at": "2020-11-18T04:52:40.210Z",
                            "updated_at": "2020-11-18T04:52:40.210Z"
                        },
                        {
                            "id": 163,
                            "question_id": 42,
                            "text": null,
                            "created_at": "2020-11-18T08:24:52.517Z",
                            "updated_at": "2020-11-18T08:24:52.517Z"
                        }
                        ]
                    },
                    {
                        "id": 43,
                        "title": "",
                        "question_type": "OPEN_ENDED",
                        "category_type": "ANSWER_NOW",
                        "points": 1,
                        "estimate_time": 11,
                        "survey_id": "42ce1633-52a0-4b24-8371-439ff62b30d2",
                        "sub_type": "SURVEY",
                        "created_at": "2020-11-18T04:52:40.294Z",
                        "updated_at": "2020-11-18T08:45:53.965Z",
                        "answers": [
                        {
                            "id": 158,
                            "question_id": 43,
                            "text": "yes ja",
                            "created_at": "2020-11-18T04:52:40.458Z",
                            "updated_at": "2020-11-18T08:45:53.975Z"
                        }
                        ]
                    }
                    ]
                }
            }
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
