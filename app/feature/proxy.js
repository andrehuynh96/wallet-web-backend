const express = require("express");
const router = express.Router();
const authenticate = require('app/middleware/authenticate.middleware');
const config = require("app/config");

module.exports = function (proxy) {
  router.post(
    '/me/kyc',
    authenticate,
    (req, res, next) => {
      let target = `${config.kyc.baseUrl}/api/kycs/me/customers/${req.user.kyc_id}/submit`;
      req.url = target;
      proxy.web(req, res, {
        secure: false,
      });
    }
  );
  return router;
}
