/*eslint no-process-env: "off"*/
require('dotenv').config();
const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  logger: {
    console: {
      enable: true,
      level: 'debug',
    },
    defaultLevel: 'debug',
    file: {
      compress: false,
      app: `${logFolder}/app.log`,
      error: `${logFolder}/error.log`,
      access: `${logFolder}/access.log`,
      format: '.yyyy-MM-dd',
    },
    appenders: ['CONSOLE', 'FILE', 'ERROR_ONLY'],
  },
  rateLimit: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  db: {
    staking: {
      database: process.env.STAKING_DB_NAME,
      username: process.env.STAKING_DB_USER,
      password: process.env.STAKING_DB_PASS,
      options: {
        host: process.env.STAKING_DB_HOST,
        port: process.env.STAKING_DB_PORT,
        dialect: 'postgres',
        logging: false
      }
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX || 'staking:batch:commission:cache',
    usingPass: process.env.REDIS_USING_PASS || 0,
    pass: process.env.REDIS_PASS,
  },

};

module.exports = config;