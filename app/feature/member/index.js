const express = require("express");
const router = express.Router();

router.use(require('./get-2fa/get-2fa.route'));
router.use(require('./set-2fa/set-2fa.route'));

module.exports = router;