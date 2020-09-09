const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const EmailTemplateDisplayName = require('app/model/wallet/value-object/email-template-display-name');
const fs = require('fs');
const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const path = require("path");

module.exports = async () => {
  let root = path.resolve(
    __dirname + "../../../../../public/email-template/moonstake/"
  );
  const emailTemplates = [{
    name: EmailTemplateTypes.TRANSACTION_RECEIVED,
    subject: 'Received coin/token alert',
    template: fs.readFileSync(path.join(root, 'transaction-received.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.TRANSACTION_RECEIVED
  }, {
    name: EmailTemplateTypes.TRANSACTION_SENT,
    subject: 'Send coin/token alert',
    template: fs.readFileSync(path.join(root, 'transaction-sent.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.TRANSACTION_SENT
  }, {
    name: EmailTemplateTypes.VERIFY_EMAIL,
    subject: 'Create Account',
    template: fs.readFileSync(path.join(root, 'verify-email.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.VERIFY_EMAIL
  }, {
    name: EmailTemplateTypes.RESET_PASSWORD,
    subject: 'Reset Password',
    template: fs.readFileSync(path.join(root, 'reset-password.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.RESET_PASSWORD
  }, {
    name: EmailTemplateTypes.DEACTIVE_ACCOUNT,
    subject: 'Delete Account',
    template: fs.readFileSync(path.join(root, 'deactive-account.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.DEACTIVE_ACCOUNT
  }, {
    name: EmailTemplateTypes.REFERRAL,
    subject: 'Invitation Email',
    template: fs.readFileSync(path.join(root, 'referral.ejs'), 'utf-8'),
    display_name: EmailTemplateDisplayName.REFERRAL
  },
  ];

  await forEach(emailTemplates, async item => {
    const emailTemplate = await EmailTemplate.findOne({
      where: {
        name: item.name,
        language: 'en',
      }
    });

    if (!emailTemplate) {
      const data = [
        {
          ...item,
          language: 'en',
        },
        {
          ...item,
          language: 'ja',
        },
      ];

      await EmailTemplate.bulkCreate(data);
    }
  });
  logger.info('Seeding email templates completed.');
};
