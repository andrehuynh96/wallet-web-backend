const express = require('express');
const authenticate = require('app/middleware/authenticate.middleware');
const controller = require('./nexo-transaction.controller');
const validator = require('app/middleware/validator.middleware');
const router = express.Router();

module.exports = router;


/*********************************************************************/
