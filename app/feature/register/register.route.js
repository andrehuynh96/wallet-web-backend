const express = require("express");
const validator = require("app/middleware/validator.middleware");
const schema = require("./register.request-schema");
const controller = require('./register.controller');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/register',
  validator(schema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  controller
);


module.exports = router;
