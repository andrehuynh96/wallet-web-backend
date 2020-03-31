const express = require("express");
const router = express.Router();
router.use(require("./get-member/get-member.route"));
router.use(require("./kyc-callback/kyc-callback.route"));
module.exports = router;