const config = require('app/config');
const express = require('express');
const router = express.Router();
const httpProxy = require('http-proxy');
const logger = require('app/lib/logger');
const Kyc = require('app/lib/kyc');
const KycStatus = require('app/model/wallet/value-object/kyc-status');


const proxy = httpProxy.createProxyServer({ target: config.kyc.baseUrl });
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  proxyReq.setHeader('x-user', JSON.stringify({ kycName: config.kyc.name }));
});
proxy.on('proxyRes', function (proxyRes, req, res) {
  _tryToApproveKYC(proxyRes, req, res);
});
router.use('/web', require('app/feature/proxy')(proxy));
module.exports = router;

async function _tryToApproveKYC(proxyRes, req, res) {
  try {
    if (proxyRes.statusCode == 200 &&
      req.method == "POST" &&
      req.path.endsWith("submit")) {
      let kycId = req.session.user.kyc_id;
      let kycLevel = await _getKycLevelApprove(kycId);
      if (kycLevel > 0) {
        let params = { body: { level: kycLevel, comment: `Auto aprrove level ${kycLevel} from ${config.emailTemplate.partnerName}` }, kycId: kycId, action: "APPROVE" };
        await Kyc.updateStatus(params);
      }
    }
  }
  catch (err) {
    logger.error("_tryToApproveKYC fail:", err);
  }
}

async function _getKycLevelApprove(kycId) {
  if (!config.kyc.autoApproveLevel || config.kyc.autoApproveLevel.length == 0) {
    return 0;
  }
  let result = await Kyc.getKycInfo({ kycId: kycId });
  let kyc = result && result.data ? result.data.customer.kyc : null;
  let level = 0;
  if (kyc) {
    let levels = Object.keys(kyc);
    for (let l of levels) {
      if (kyc[l].status == KycStatus.IN_REVIEW) {
        level = l;
        break;
      }
    }
  }

  return (config.kyc.autoApproveLevel.includes(level)) ? parseInt(level) : 0;
}