const KycPermission = require('app/model/wallet/value-object/kyc-permission');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
module.exports = function (permission) {
  return async function (req, res, next) {
    if (!req.user.kyc_level || !req.user.kyc_status) {
      res.forbidden();
    } else {
      let permissionLv =  req.user.kyc_level;
      let permissions = KycPermission[`${permissionLv}`];
      if (permissions.indexOf(permission) == -1) {
        res.forbidden();
      } else {
        next();
      }
    }
  }
}
