const express = require('express');
const controller = require('./reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/accounts',
  authenticate,
  controller.getRewards
);

module.exports = router;
