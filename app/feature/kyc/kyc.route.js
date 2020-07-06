const express = require('express');
const controller = require('./kyc.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/kycs/permissions',
  authenticate,
  controller.get
);

router.get(
  '/kycs/schema',
  authenticate,
  controller.schema
);

router.get(
  '/kycs/:key/properties',
  authenticate,
  controller.getProperties
);

module.exports = router;

/*********************************************************************/

/**
 * @swagger
 * /web/kycs/permissions:
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


/**
 * @swagger
 * /web/kycs/schema:
 *   get:
 *     summary: get kyc schema
 *     tags:
 *       - Kyc
 *     description:
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
               "data": [
                  {
                    "id": 1,
                    "name": "Level 0",
                    "key": "LEVEL_0",
                    "description": "",
                    "order_index": 0,
                    "prev_level": 0,
                    "have_to_pass_prev_level_flg": false,
                    "auto_approve_flg": true,
                    "created_at": "2020-07-05T15:37:53.216Z",
                    "updated_at": "2020-07-05T15:37:53.216Z",
                    "kyc_properties": [
                      {
                        "id": 1,
                        "kyc_id": 1,
                        "field_name": "Email",
                        "field_key": "email",
                        "description": "Your Email",
                        "data_type": "EMAIL",
                        "member_field": "email",
                        "require_flg": true,
                        "check_data_type_flg": true,
                        "order_index": 0,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.103Z",
                        "updated_at": "2020-07-05T15:37:58.103Z"
                      },
                      {
                        "id": 2,
                        "kyc_id": 1,
                        "field_name": "Password",
                        "field_key": "password",
                        "description": "Your Password",
                        "data_type": "PASSWORD",
                        "member_field": "password_hash",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 1,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.103Z",
                        "updated_at": "2020-07-05T15:37:58.103Z"
                      }
                    ]
                  },
                  {
                    "id": 2,
                    "name": "Level 1",
                    "key": "LEVEL_1",
                    "description": "",
                    "order_index": 0,
                    "prev_level": 1,
                    "have_to_pass_prev_level_flg": true,
                    "auto_approve_flg": true,
                    "created_at": "2020-07-05T15:37:53.394Z",
                    "updated_at": "2020-07-05T15:37:53.394Z",
                    "kyc_properties": [
                      {
                        "id": 3,
                        "kyc_id": 2,
                        "field_name": "Full Name",
                        "field_key": "fullname",
                        "description": "Your Full Name",
                        "data_type": "TEXT",
                        "member_field": "fullname",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 2,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.268Z",
                        "updated_at": "2020-07-05T15:37:58.268Z"
                      },
                      {
                        "id": 4,
                        "kyc_id": 2,
                        "field_name": "Country",
                        "field_key": "country",
                        "description": "Your Country",
                        "data_type": "TEXT",
                        "member_field": "country",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 3,
                        "enabled_flg": true,
                        "group_name": "Country & City of residence",
                        "created_at": "2020-07-05T15:37:58.268Z",
                        "updated_at": "2020-07-05T15:37:58.268Z"
                      },
                      {
                        "id": 5,
                        "kyc_id": 2,
                        "field_name": "City",
                        "field_key": "city",
                        "description": "Your City",
                        "data_type": "TEXT",
                        "member_field": "city",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 4,
                        "enabled_flg": true,
                        "group_name": "Country & City of residence",
                        "created_at": "2020-07-05T15:37:58.268Z",
                        "updated_at": "2020-07-05T15:37:58.268Z"
                      },
                      {
                        "id": 6,
                        "kyc_id": 2,
                        "field_name": "Date of birth",
                        "field_key": "date_of_birth",
                        "description": "Your BOD",
                        "data_type": "DATETIME",
                        "member_field": "date_of_birth",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 5,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.268Z",
                        "updated_at": "2020-07-05T15:37:58.268Z"
                      }
                    ]
                  },
                  {
                    "id": 3,
                    "name": "Level 2",
                    "key": "LEVEL_2",
                    "description": "",
                    "order_index": 0,
                    "prev_level": 2,
                    "have_to_pass_prev_level_flg": true,
                    "auto_approve_flg": true,
                    "created_at": "2020-07-05T15:37:53.557Z",
                    "updated_at": "2020-07-05T15:37:53.557Z",
                    "kyc_properties": [
                      {
                        "id": 7,
                        "kyc_id": 3,
                        "field_name": "Phone",
                        "field_key": "phone",
                        "description": "Your Phone",
                        "data_type": "TEXT",
                        "member_field": "phone",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 0,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.436Z",
                        "updated_at": "2020-07-05T15:37:58.436Z"
                      },
                      {
                        "id": 8,
                        "kyc_id": 3,
                        "field_name": "Address",
                        "field_key": "address",
                        "description": "Your Address",
                        "data_type": "TEXT",
                        "member_field": "address",
                        "require_flg": true,
                        "check_data_type_flg": false,
                        "order_index": 1,
                        "enabled_flg": true,
                        "group_name": "",
                        "created_at": "2020-07-05T15:37:58.436Z",
                        "updated_at": "2020-07-05T15:37:58.436Z"
                      }
                    ]
                  }
                ]
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
 * /web/kycs/{key}/properties:
 *   get:
 *     summary: get kyc schema properties
 *     tags:
 *       - Kyc
 *     description:
 *     parameters:
 *       - in: path
 *         name: key
 *         type: string
 *         required: true  
 *     responses:
 *       200:
 *         description: Ok
 *         examples:
 *           application/json:
 *             {
               "data": [
                  {
                    "id": 1,
                    "field_name": "Email",
                    "field_key": "email",
                    "description": "Your Email",
                    "data_type": "EMAIL",
                    "member_field": "email",
                    "require_flg": true,
                    "check_data_type_flg": true,
                    "order_index": 0,
                    "enabled_flg": true,
                    "group_name": "",
                    "created_at": "2020-07-05T15:37:58.103Z",
                    "updated_at": "2020-07-05T15:37:58.103Z"
                  },
                  {
                    "id": 2,
                    "field_name": "Password",
                    "field_key": "password",
                    "description": "Your Password",
                    "data_type": "PASSWORD",
                    "member_field": "password_hash",
                    "require_flg": true,
                    "check_data_type_flg": false,
                    "order_index": 1,
                    "enabled_flg": true,
                    "group_name": "",
                    "created_at": "2020-07-05T15:37:58.103Z",
                    "updated_at": "2020-07-05T15:37:58.103Z"
                  }
                ]
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