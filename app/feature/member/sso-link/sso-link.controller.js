const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');

module.exports = async (req, res, next) => {
  try {
    const refreshToken = req.session.refreshToken;
    if (!refreshToken) {
      return res.badRequest(res.__("REFRESH_TOKEN_IS_EMPTY"), "REFRESH_TOKEN_IS_EMPTY");
    }

    const member = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
    }

    const createSsoTokenResult = await PluTXUserIdApi.createSsoToken(member.plutx_userid_id, refreshToken);
    if (createSsoTokenResult.httpCode !== 200) {
      return res.status(createSsoTokenResult.httpCode).send(createSsoTokenResult.data);
    }

    const tokenId = createSsoTokenResult.data.id;
    const ssoLink = `${config.website.ssoLoginUrl}${tokenId}`;

    return res.ok({ ssoLink });
  }
  catch (err) {
    logger.error('Create SSO link:', err);

    next(err);
  }
};
