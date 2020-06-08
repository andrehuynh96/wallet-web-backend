const nodemailer = require('nodemailer');
const config = require('app/config');
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const EmailTemplate = require('email-templates');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
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


module.exports = transporter;
