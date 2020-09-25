const express = require("express");
const router = express.Router();
router.use(require("./coin/coin.route"));
router.use(require("./token/token.route"));
module.exports = router;
