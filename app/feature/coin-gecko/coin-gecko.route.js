const express = require('express');
const config = require('app/config');
const authenticate = require('app/middleware/authenticate.middleware');
const cache = require('app/middleware/cache.middleware');
const controller = require('./coin-gecko.controller');
const router = express.Router();

router.get('/coin-gecko/prices',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getPrice
);

router.get('/coin-gecko/histories',
  authenticate,
  cache(config.cacheDurationTime),
  controller.getHistories
);

module.exports= router;
