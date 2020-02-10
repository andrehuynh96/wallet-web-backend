const express = require('express');
const validator = require('app/middleware/validator.middleware');
const authenticate = require('app/middleware/authenticate.middleware');
const parseformdata = require('app/middleware/parse-formdata.middleware');
const { create } = require('./validator');
const controller = require('./wallet.controller');

const router = express.Router();

router.post(
  '/wallets',
  parseformdata,
  authenticate,
  validator(create),
  controller.create
);

module.exports = router;