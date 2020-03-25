const express = require("express");
const router = express.Router();
const controller = require("./get-member.controller");

router.get("/members", controller)
module.exports = router;