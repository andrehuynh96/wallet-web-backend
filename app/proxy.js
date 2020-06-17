const config = require('app/config');
const express = require('express');
const router = express.Router();
const httpProxy = require('http-proxy');


const proxy = httpProxy.createProxyServer({ target: config.kyc.baseUrl });
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('x-user', JSON.stringify({ kycName: config.kyc.name }));
});
router.use('/web', require('app/feature/proxy')(proxy));
module.exports = router;