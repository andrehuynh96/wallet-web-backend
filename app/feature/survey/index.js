const express = require('express');
const router = express.Router();

router.use(require("./survey.route"));

module.exports = router;