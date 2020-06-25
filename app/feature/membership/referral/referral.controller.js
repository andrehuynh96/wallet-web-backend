const logger = require('app/lib/logger');
const config = require('app/config');
const mailer = require('app/lib/mailer');
const Member = require('app/model/wallet').members;


module.exports = {
  invite: async (req, res, next) => {
    try {
      let {body: { emails }, user: {id} } = req;
      let member = await Member.findOne({
        where: {
          deleted_flg: false,
          id: id 
        }
      })
      if (!member) {
        return res.badRequest(res.__('MEMBER_NOT_FOUND'), 'MEMBER_NOT_FOUND');
      }
      if (!member.referral_code) {
        return res.badRequest(res.__('REFERRAL_CODE_NOT_FOUND'), 'REFERRAL_CODE_NOT_FOUND');
      }
      _sendEmailReferral(member.fullname, member.email, emails, member.referral_code);
      return res.ok(true);
  } catch (error) {
      logger.error(error);
      next(error);
  }
}

}

async function _sendEmailReferral(memberName, memberEmail, emails, referralCode) {
  try {
    let subject = ` ${config.emailTemplate.partnerName} - Invitation Email`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.membership.referralUrl}/${referralCode}`,
      name: memberName,
      email: memberEmail
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, emails, data, config.emailTemplate.referral);
  } catch (err) {
    logger.error("send confirmed email for changing reward address for master pool fail", err);
  }
}