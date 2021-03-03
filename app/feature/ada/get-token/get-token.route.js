const express = require('express');
const controller = require('./get-token.controller');
const authenticate = require('app/middleware/authenticate.middleware');
const router = express.Router();

router.get('/ada/tokens',
  authenticate,
  controller.search
);


module.exports = router;
