const express = require("express");
const router = express.Router();
router.use(require("./currency/currency.route"));
router.use(require("./get-min-amount/get-min-amount.route"));
router.use(require("./transaction-history/transaction-history.route"));
router.use(require("./transaction-detail/transaction-detail.route"));

module.exports = router;