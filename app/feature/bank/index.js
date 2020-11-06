const express = require("express");
const router = express.Router();
router.use('/nexo', require("./nexo"));

module.exports = router;