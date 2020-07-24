const EmailTemplate = require('app/model/wallet').email_templates;
const EmailTemplateTypes = require('app/model/wallet/value-object/email-template-type');
const fs = require('fs');
const logger = require('app/lib/logger');
const path = require("path");

module.exports = async () => {
    const emailNames = Object.values(EmailTemplateTypes);
    let root = path.resolve(
        __dirname + "../../../../../public/email-template/moonstake/"
    );
    const data = [{
        name: EmailTemplateTypes.TRANSACTION_RECEIVED,
        subject: 'Received coin/token alert',
        template: fs.readFileSync(path.join(root, 'transaction-received.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.TRANSACTION_SENT,
        subject: 'Membership payment',
        template: fs.readFileSync(path.join(root, 'transaction-sent.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.VERIFY_EMAIL,
        subject: 'Create Account',
        template: fs.readFileSync(path.join(root, 'verify-email.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.RESET_PASSWORD,
        subject: 'Reset Password',
        template: fs.readFileSync(path.join(root, 'reset-password.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.DEACTIVE_ACCOUNT,
        subject: 'Delete Account',
        template: fs.readFileSync(path.join(root, 'deactive-account.ejs'), 'utf-8'),
    }, {
        name: EmailTemplateTypes.REFERRAL,
        subject: 'Invitation Email',
        template: fs.readFileSync(path.join(root, 'referral.ejs'), 'utf-8'),
    },
];

    for (let item of emailNames) {
        const emailTemplate = await EmailTemplate.findAll({
            where: {
                name: item,
                language: ['en', 'jp']
            }
        });
        if (emailTemplate.length === 0) {
            const unavailableEmail = data.find(x => x.name === item);
            const emailTemplateData = [{
                ...unavailableEmail, language: 'en'
            }, {
                ...unavailableEmail, language: 'jp'
            }];
            
            await EmailTemplate.bulkCreate(emailTemplateData,{ returning:true });
            logger.info('insert email template',item);
        }
    }
};
