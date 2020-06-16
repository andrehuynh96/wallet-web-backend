const express = require('express');
const controller = require('./claim.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/claim',
  authenticate,
  controller.getClaims
);

router.post(
  '/claim',
  authenticate,
  // validator(create),
  controller.create
);

module.exports = router;

