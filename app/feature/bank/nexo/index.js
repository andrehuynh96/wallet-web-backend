const express = require("express");
const router = express.Router();
router.use(require("./member/nexo-member.route"));
router.use(require("./transaction/nexo-transaction.route"));
router.use(require("./deposit/nexo-deposit.route"));
router.use(require("./withdraw/nexo-withdraw.route"));
router.use(require("./currency/currency.route"));
router.use(require("./webhook/webhook.route"));

module.exports = router;