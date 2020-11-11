const express = require("express");
const router = express.Router();
router.use(require("./member/nexo-member.route"));
router.use(require("./transaction/nexo-transaction.route"));
router.use(require("./deposit/nexo-deposit.route"));

module.exports = router;