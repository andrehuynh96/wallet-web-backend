const express = require('express');
const controller = require('./reward.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get(
  '/reward',
  authenticate,
  controller.getReward
);

router.get(
  '/reward/history',
  authenticate,
  controller.getHistorys
);
module.exports = router;
