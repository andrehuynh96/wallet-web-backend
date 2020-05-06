const express = require("express");
const router = express.Router();
router.use(require("./get-member/get-member.route"));
router.use(require("./kyc-callback/kyc-callback.route"));
router.use(require("./webhook/webhook.route"));
module.exports = router;