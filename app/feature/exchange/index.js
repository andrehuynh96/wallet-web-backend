const express = require("express");
const router = express.Router();
router.use(require("./currency/currency.route"));
router.use(require("./get-min-amount/get-min-amount.route"));
router.use(require("./estimate/estimate.route"));
router.use(require("./make-transaction/make-transaction.route"));
router.use(require("./transaction-history/transaction-history.route"));
router.use(require("./transaction-detail/transaction-detail.route"));
router.use(require("./update-transaction/update-transaction.route"));

module.exports = router;