const { forEach } = require('p-iteration');
const logger = require('app/lib/logger');
const config = require('app/config');
const EmailLogging = require('app/model/wallet').email_loggings;
const BlacklistEmail = require('app/model/wallet').blacklist_emails;

const pixelBytes = new Buffer(35);
pixelBytes.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");

module.exports = {
  view: async (req, res) => {
    try {
      const { params } = req;
      const emailLogging = await EmailLogging.findOne({
        where: {
          id: params.id,
        }
      });

      if (emailLogging) {
        await EmailLogging.update(
          { num_of_views: emailLogging.num_of_views + 1 },
          {
            where: {
              id: emailLogging.id,
            },
          }
        );
      }

    }
    catch (error) {
      logger.error('get email template detail fail', error);
    }

    // Disable browser caching
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Always send a 200 with the 1x1 pixel
    res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
  },
  webhook: async (req, res, next) => {
    try {
      const { body, query } = req;
      const token = query.token;
      if (token !== config.webWallet.trackingEmailApiToken) {
        return res.forbidden(res.__("TRACKING_EMAIL_WRONG_TOKEN"), "TRACKING_EMAIL_WRONG_TOKEN");
      }

      let message = null;
      try {
        message = JSON.parse(body.Message);
      } catch (error1) {
        return res.badRequest(res.__("CAN_NOT_PARSE_MESSAGE"), "CAN_NOT_PARSE_MESSAGE");
      }

      if (!message) {
        return res.ok(true);
      }

      logger.info(JSON.stringify(message));
      const { notificationType, bounce, mail } = message || {};
      const mailMessageId = (mail && mail.commonHeaders) ? mail.commonHeaders.messageId : null;
      let { bounceType, bounceSubType, bouncedRecipients } = bounce || {};
      bouncedRecipients = bouncedRecipients || [];
      bounceType = bounceType || '';
      bounceSubType = bounceSubType || '';

      if (mailMessageId) {
        await forEach((bouncedRecipients || []), async bouncedRecipient => {
          const { emailAddress, action, diagnosticCode } = bouncedRecipient;
          await EmailLogging.update(
            {
              status: action,
              diagnostic_code: diagnosticCode,
            },
            {
              where: {
                mail_message_id: mailMessageId,
                email: emailAddress,
              },
            }
          );
        });
      }

      // Save this email to blacklist
      if ((notificationType || '').toUpperCase() === 'BOUNCE') {
        if (bounceType.toUpperCase() === 'PERMANENT') {
          await forEach((bouncedRecipients || []), async bouncedRecipient => {
            const { emailAddress, diagnosticCode } = bouncedRecipient;

            await BlacklistEmail.create({
              email: emailAddress.trim().toLowerCase(),
              bounce_type: bounceType,
              bounce_sub_type: bounceSubType,
              diagnostic_code: diagnosticCode,
            });
          });
        }
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error('webHook fail', err);
      next(err);
    }
  },
};
