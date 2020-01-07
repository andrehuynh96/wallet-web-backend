const express = require('express');
const config = require('app/config')
const verifyRecaptcha = require('app/middleware/verify-recaptcha.middleware');
const validator = require('app/middleware/validator.middleware');
const loginRequestSchema = require('./login.request-schema');
const loginController = require('./login.controller');

console.log(config)
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(config.recaptchaSiteKey, config.recaptchaSecret);
const router = express.Router();

router.post(
  '/login',
  validator(loginRequestSchema),
  recaptcha.middleware.verify,
  verifyRecaptcha,
  loginController
);

module.exports = router;
