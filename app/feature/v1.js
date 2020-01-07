const express = require("express");
const router = express.Router();

router.use(require('./login/login.route'));

module.exports = router; 