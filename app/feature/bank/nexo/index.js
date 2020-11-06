const express = require("express");
const router = express.Router();
router.use(require("./member/nexo-member.route"));
router.use(require("./transaction/nexo-transaction.route"));

module.exports = router;