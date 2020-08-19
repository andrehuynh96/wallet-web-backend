const nodemailer = require('nodemailer');
const config = require('app/config');
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const EmailTemplate = require('email-templates');

const root = path.resolve(__dirname + "../../../../public/email-template/");

let transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

transporter.getMailTemplate = async (data, fileName) => {
  const email = new EmailTemplate({
    views: { root, options: { extension: 'ejs' } }
  });
  const mailContent = await email.render(fileName, data);
  return mailContent;
};

transporter.getRawTemplate = (templateFile) => {
  return fs.readFileSync(path.join(root, templateFile), { encoding: 'utf8', flag: 'r' });
};

transporter.sendWithTemplate = async function (
  subject,
  from,
  to,
  data,
  templateFile
) {
  let mailContent = await transporter.getMailTemplate(data, templateFile);
  return await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: mailContent
  });

};

transporter.getMailDBTemplate = async (template, data) => {
  const email = new EmailTemplate({
    render: (template, locals) => {
      return new Promise((resolve, reject) => {
        try {
          const options = { delimiter: '_', openDelimiter: '$', closeDelimiter: '$' };
          let html = ejs.render(template, locals, options);
          resolve(html);
        } catch (error) {
          reject(error);
        }
      });
    }
  });

  const mailContent = await email.render(template, data);
  return mailContent;
};

transporter.sendWithDBTemplate = async function (
  subject,
  from,
  to,
  data,
  template
) {
  let mailContent = await transporter.getMailDBTemplate(template, data);
  console.log('Send email with template',template);
  return await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: mailContent
  });
};

module.exports = transporter;
