const express = require("express");
const router = express.Router();
router.use(require("./claim-point/claim-point.route"));
router.use("/points", require("./tracking/tracking.route"));

module.exports = router;