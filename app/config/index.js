/*eslint no-process-env: "off"*/
require('dotenv').config();
const logFolder = process.env.LOG_FOLDER || './public/logs';

const config = {
  level: process.env.LOG_LEVEL,
  logger: {
    console: {
      enable: true,
      level: process.env.LOG_LEVEL,
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
    wallet: {
      database: process.env.WALLET_DB_NAME,
      username: process.env.WALLET_DB_USER,
      password: process.env.WALLET_DB_PASS,
      options: {
        host: process.env.WALLET_DB_HOST,
        port: process.env.WALLET_DB_PORT,
        dialect: 'postgres',
        logging: false
      }
    }
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: process.env.REDIS_PREFIX || 'staking:wallet:cache',
    usingPass: process.env.REDIS_USING_PASS || 0,
    pass: process.env.REDIS_PASS,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE.toLowerCase() === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  mailSendAs: process.env.MAIL_SEND_AS || 'no-reply@infinito.io',
  emailTemplate: {
    partnerName: process.env.PARTNER_NAME,
    verifyEmail: process.env.PARTNER_NAME.toLowerCase() + "/verify-email.ejs",
    resetPassword: process.env.PARTNER_NAME.toLowerCase() + "/reset-password.ejs",
    deactiveAccount: process.env.PARTNER_NAME.toLowerCase() + "/deactive-account.ejs",
    txSent: process.env.PARTNER_NAME.toLowerCase() + "/transaction-sent.ejs",
    txReceived: process.env.PARTNER_NAME.toLowerCase() + "/transaction-received.ejs",
    deactiveAccountToAdmin: process.env.PARTNER_NAME.toLowerCase() + "/deactive-account-admin.ejs"
  },
  disableRecaptcha: process.env.DISABLE_RECAPTCHA == "1",
  CDN: {
    url: process.env.CDN_URL,
    accessKey: process.env.CDN_ACCESS_KEY,
    secretKey: process.env.CDN_SECRET_KEY,
    bucket: process.env.CDN_BUCKET,
    folderPlatform: process.env.CDN_FOLDER_PLATFORM,
    exts: process.env.CDN_FILE_EXT ? process.env.CDN_FILE_EXT.split(',')
      : [],
    fileSize: process.env.CDN_FILE_SIZE ? parseFloat(process.env.CDN_FILE_SIZE) : 5242880
  },
  enableDocsLink: process.env.ENABLE_DOCS_LINK == "1",
  expiredVefiryToken: process.env.EXPIRED_VERIFY_TOKEN ? parseInt(process.env.EXPIRED_VERIFY_TOKEN) : 2,
  enableSeed: process.env.ENABLE_SEED == "1",
  linkWebsiteVerify: process.env.WEBSITE_URL + '/reset-password/set-new-password?token=',
  website: {
    url: process.env.WEBSITE_URL,
    urlActive: process.env.WEBSITE_URL + '/email-verification?token=',
    urlUnsubscribe: process.env.WEBSITE_URL + '/confirm-unsubscribe?token=',
    urlImages: process.env.PARTNER_NAME ? process.env.WEBSITE_URL + '/images/' + process.env.PARTNER_NAME.toLowerCase() : process.env.WEBSITE_URL + '/images',
    urlIcon: process.env.WEBSITE_URL + '/images/platforms/'
  },
  aws: {
    endpoint: process.env.AWS_END_POINT,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET
  },
  appLimit: process.env.APP_LIMIT || 10,
  lockUser: {
    maximumTriesLogin: process.env.MAXIMUM_TRIES_LOGIN,
    lockTime: process.env.LOCK_TIME
  },
  kyc: {
    baseUrl: process.env.KYC_URL,
    authUrl: process.env.KYC_WEBSITE_URL + `/${process.env.KYC_NAME}?token=`,
    name: process.env.KYC_NAME,
    type: process.env.KYC_TYPE,
    schema: process.env.KYC_SCHEMA
  },
  stakingApi: {
    url: process.env.STAKING_API_URL,
    key: process.env.STAKING_API_KEY,
    secret: process.env.STAKING_API_SECRET,
    jwksUrl: process.env.STAKING_API_JWK_URL,
    kid: process.env.STAKING_API_KID,
  },
  explorer: {
    ETH: {
      platformName: "Ethereum",
      txIdLink: process.env.ETH_TX_ID_LINK,
      addressLink: process.env.ETH_ADDRESS_LINK
    },
    IRIS: {
      platformName: "IRISnet",
      txIdLink: process.env.IRIS_TX_ID_LINK,
      addressLink: process.env.IRIS_ADDRESS_LINK
    },
    ATOM: {
      platformName: "Cosmos",
      txIdLink: process.env.ATOM_TX_ID_LINK,
      addressLink: process.env.ATOM_ADDRESS_LINK
    },
    BTC: {
      platformName: "Bitcoin",
      txIdLink: process.env.BTC_TX_ID_LINK,
      addressLink: process.env.BTC_ADDRESS_LINK
    },
    ONT: {
      platformName: "Ontology",
      txIdLink: process.env.ONT_TX_ID_LINK,
      addressLink: process.env.ONT_ADDRESS_LINK
    },
    ADA: {
      platformName: "Cardano",
      txIdLink: process.env.ADA_TX_ID_LINK,
      addressLink: process.env.ADA_ADDRESS_LINK
    },
  },
  sdk: {
    baseUrl: process.env.SDK_URL,
    apiKey: process.env.SDK_API_KEY,
    secretKey: process.env.SDK_SECRET_KEY
  },
  plutx: {
    domain: process.env.PLUTX_DOMAIN,
    format: process.env.PLUTX_FORMAT,
    url: process.env.PLUTX_URL
  }
};

module.exports = config;
