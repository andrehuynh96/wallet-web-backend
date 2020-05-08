const express = require("express");
const router = express.Router();

router.use(require('./get-2fa/get-2fa.route'));
router.use(require('./set-2fa/set-2fa.route'));
router.use(require('./profile/profile.route'));
router.use(require('./login-history/login-history.route'));
router.use(require('./change-password/change-password.route'));
router.use(require('./kyc-link/kyc-link.route'));
router.use(require('./update-referrer/update-referrer.route'));

module.exports = router;