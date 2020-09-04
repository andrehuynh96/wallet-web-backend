const express = require("express");
const router = express.Router();
router.use(require("./currency/currency.route"));
router.use(require("./get-min-amount/get-min-amount.route"));

module.exports = router;