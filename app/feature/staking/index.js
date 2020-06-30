const express = require("express");
const router = express.Router();
router.use(require("./reward/reward.route"));
module.exports = router;