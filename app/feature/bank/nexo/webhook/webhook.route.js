const express = require('express');
const controller = require('./webhook.controller');
const router = express.Router();

router.post(
  '/webhook',
  controller.index
)

module.exports = router;
