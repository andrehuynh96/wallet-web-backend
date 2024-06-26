const express = require("express");
const router = express.Router();
router.use(require("./claim/claim.route"));
router.use(require("./reward/reward.route"));
router.use(require("./order/order.route"));
router.use(require("./member/member.route"));
router.use(require("./account/account.route"));
router.use(require("./referral/referral.route"));
router.use(require("./member-reward-transaction-his/member-reward-transaction-his.route"));
module.exports = router;