const express = require("express");
const router = express.Router();
router.use(require("./claim/claim.route"));
router.use(require("./reward/reward.route"));
router.use(require("./order/order.route"));
router.use(require("./member/member.route"));
module.exports = router;