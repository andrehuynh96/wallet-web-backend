const express = require("express");
const router = express.Router();
router.use(require("./currency/currency.route"));
router.use(require("./crypto-currency/crypto-currency.route"));
router.use(require("./payment-method/payment-method.route"));
router.use(require("./transaction/transaction.route"));

module.exports = router;