const express = require("express");
const controller = require('./get-2fa.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/2fa',
  authenticate,
  controller
);

module.exports = router;

