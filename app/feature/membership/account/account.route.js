const express = require('express');
const controller = require('./account.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();
const { createBankAccount, updateBankAccount } = require("./validator")
const validator = require("app/middleware/validator.middleware");

router.get(
  '/accounts/crypto/setting',
  authenticate,
  controller.getCryptoAccountSetting
);

router.get(
  '/accounts/crypto',
  authenticate,
  controller.getCryptoAccount
);

router.get(
  '/accounts/bank-account/currencies',
  controller.getBankCurrency
);


router.get(
  '/accounts/bank-account',
  authenticate,
  controller.getBankAccount
);

router.get(
  '/accounts/bank-account/:id',
  authenticate,
  controller.getBankAccountDetail
);

router.post(
  '/accounts/bank-account',
  authenticate,
  validator(createBankAccount),
  controller.createBankAccount
);

router.put(
  '/accounts/bank-account/:id',
  authenticate,
  validator(updateBankAccount),
  controller.editBankAccount
);

router.delete(
  '/accounts/bank-account/:id',
  authenticate,
  controller.deleteBankAccount
);


module.exports = router;

/**
* @swagger
* /web/membership/accounts/crypto/setting:
*   get:
*     summary: get crypto accounts (return platform not configured yet aswell)
*     tags:
*       - membership
*     description: get crypto accounts (return platform not configured yet aswell)
*     parameters:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":[{
                    "id": 1,
                    "currency_symbol": "USDT",
                    "wallet_id": "46e11269-b0c4-42b6-987c-54e1a706a84b",
                    "wallet_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                  }]
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
* /web/membership/accounts/crypto:
*   get:
*     summary: get crypto accounts
*     tags:
*       - membership
*     description: get crypto accounts
*     parameters:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":[{
                    "id": 1,
                    "currency_symbol": "USDT",
                    "wallet_id": "46e11269-b0c4-42b6-987c-54e1a706a84b",
                    "wallet_address": "0x5dA1D9eC5DF67f3deFf8EC6aBa205F9c4638E04E",
                  }]
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
* /web/membership/accounts/bank-account/currencies:
*   get:
*     summary: get currency support
*     tags:
*       - membership
*     description: get currency support
*     parameters:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":[{
                    "code": 'VND',
                    "name": "VND"
                  }]
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
* /web/membership/accounts/bank-account:
*   get:
*     summary: get bank accounts
*     tags:
*       - membership
*     description: get bank accounts
*     parameters:
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":[{
                    "id": 1,
                    "currency_symbol": 'VND',
                    "member_id": 1,
                    "bank_name": "City Bank",
                    "branch_name": 'Tokyo',
                    "account_holder": 'Jamamoto',
                    "account_number": '122112211122',
                    "account_address": 'kyoto',
                    "swift": "1122",
                    "default_flg": true
                  }]
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
* /web/membership/accounts/bank-account/{id}:
*   get:
*     summary: get bank account detail
*     tags:
*       - membership
*     description: get bank account detail
*     parameters:
*       - in: path
*         name: id
*         type: string
*         required: true
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data":{
                    "id": 1,
                    "currency_symbol": 'VND',
                    "member_id": 1,
                    "bank_name": "City Bank",
                    "branch_name": 'Tokyo',
                    "account_holder": 'Jamamoto',
                    "account_number": '122112211122',
                    "account_address": 'kyoto',
                    "swift": "1122",
                    "default_flg": true
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
* /web/membership/accounts/bank-account/{id}:
*   delete:
*     summary: delete bank account
*     tags:
*       - membership
*     description: get bank account
*     parameters:
*       - in: path
*         name: id
*         type: string
*         required: true
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


/**
* @swagger
* /web/membership/accounts/bank-account:
*   post:
*     summary: create bank account
*     tags:
*       - membership
*     description: create bank account
*     parameters:
*       - in: body
*         name: data
*         description: Data submit.
*         schema:
*            type: object
*            example:
*               {
                    "currency_symbol": 'VND',
                    "bank_name": "City Bank",
                    "branch_name": 'Tokyo',
                    "account_holder": 'Jamamoto',
                    "account_number": '122112211122',
                    "account_address": 'kyoto',
                    "swift": "1122",
                    "default_flg": true
                }
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



/**
* @swagger
* /web/membership/accounts/bank-account/{id}:
*   put:
*     summary: update bank account
*     tags:
*       - membership
*     description: update bank account
*     parameters:
*       - in: body
*         name: data
*         description: Data submit.
*         schema:
*            type: object
*            example:
*               {
                    "currency_symbol": 'VND',
                    "bank_name": "City Bank",
                    "branch_name": 'Tokyo',
                    "account_holder": 'Jamamoto',
                    "account_number": '122112211122',
                    "account_address": 'kyoto',
                    "swift": "1122",
                    "default_flg": true
                }
*     responses:
*       200:
*         description: Ok
*         examples:
*           application/json:
*             {
*                 "data": {
                    "id": 1,
                    "currency_symbol": 'VND',
                    "member_id": 1,
                    "bank_name": "City Bank",
                    "branch_name": 'Tokyo',
                    "account_holder": 'Jamamoto',
                    "account_number": '122112211122',
                    "account_address": 'kyoto',
                    "swift": "1122",
                    "default_flg": true
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