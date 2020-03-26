const express = require("express");
const router = express.Router();
router.use(require("./get-member/get-member.route"));
module.exports = router;