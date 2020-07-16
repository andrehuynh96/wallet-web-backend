const express = require("express");
const router = express.Router();
router.use(require("./reward/reward.route"));
router.use(require("./claim-reward/claim.route"));
router.use(require("./member-reward-transaction-his/member-reward-transaction-his.route"));

module.exports = router;