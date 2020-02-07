const express = require("express");
const controller = require('./set-2fa.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const validator = require('app/middleware/validator.middleware');
const schema = require("./set-2fa.request-schema");
const router = express.Router();

router.post(
  '/me/2fa',
  validator(schema),
  authenticate,
  controller
);

module.exports = router;

