const logger = require('app/lib/logger');
const config = require('app/config');
const { query } = require('express');
const EmailLogging = require('app/model/wallet').email_loggings;

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
  webHook: async (req, res, next) => {
    try {
      const { params, body, query } = req;
      const token = query.token;
      if (token !== config.webWallet.trackingEmailApiToken) {
        return res.forbidden(res.__("TRACKING_EMAIL_WRONG_TOKEN"), "TRACKING_EMAIL_WRONG_TOKEN");
      }

      const emailLogging = await EmailLogging.findOne({
        where: {
          id: params.id,
        }
      });

      if (emailLogging) {
        await EmailLogging.update(
          {

          },
          {
            where: {
              id: emailLogging.id,
            },
          }
        );
      }

      return res.ok(true);
    }
    catch (err) {
      logger.error('webHook fail', err);
      next(err);
    }
  },
};
