const express = require("express");
const router = express.Router();
router.use("/membership",require("./page"));
module.exports = router;