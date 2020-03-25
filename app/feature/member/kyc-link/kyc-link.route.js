const express = require("express");
const controller = require('./kyc-link.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/me/kyc-link',
  authenticate,
  controller
);

module.exports = router;