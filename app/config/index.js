/* eslint no-process-env: "off"*/
const pkg = require('../../package.json');
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
  app: {
    name: process.env.APP_NAME || 'staking-web-wallet-api',
    version: pkg.version,
    buildNumber: process.env.BUILD_NUMBER || process.env.CI_JOB_ID || '',
    description: pkg.description,
    port: parseInt(process.env.PORT || process.env.APP_PORT),
  },
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
    ignoreTLS: (process.env.SMTP_IGNORE_TLS || '').toLowerCase() === 'true',
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
    deactiveAccountToAdmin: process.env.PARTNER_NAME.toLowerCase() + "/deactive-account-admin.ejs",
    referral: process.env.PARTNER_NAME.toLowerCase() + "/referral.ejs"
  },
  disableRecaptcha: process.env.DISABLE_RECAPTCHA == "1",
  CDN: {
    url: process.env.CDN_URL,
    accessKey: process.env.CDN_ACCESS_KEY,
    secretKey: process.env.CDN_SECRET_KEY,
    bucket: process.env.CDN_BUCKET,
    folderPlatform: process.env.CDN_FOLDER_PLATFORM,
    folderKYC: process.env.CDN_FOLDER_KYC,
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
    urlIcon: process.env.WEBSITE_URL + '/images/platforms/',
    ssoLoginUrl: process.env.WEBSITE_URL + '/sign-in?token=',
    urlDeleteWallet: process.env.WEBSITE_URL + '/sign-in?type=delete_wallet&token='
  },
  aws: {
    endpoint: process.env.AWS_END_POINT,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
    bucketUrls: process.env.AWS_BUCKET_URLS ? process.env.AWS_BUCKET_URLS.split(",") : []
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
    schema: process.env.KYC_SCHEMA,
    autoApproveLevel: process.env.KYC_AUTO_APPROVE_LEVEL ? process.env.KYC_AUTO_APPROVE_LEVEL.split(",") : [],
  },
  stakingApi: {
    url: process.env.STAKING_API_URL,
    key: process.env.STAKING_API_KEY,
    secret: process.env.STAKING_API_SECRET,
    jwksUrl: process.env.STAKING_API_JWK_URL,
    kid: process.env.STAKING_API_KID,
  },

  sdk: {
    baseUrl: process.env.SDK_URL,
    apiKey: process.env.SDK_API_KEY,
    secretKey: process.env.SDK_SECRET_KEY
  },
  affiliate: {
    url: process.env.AFFILIATE_URL,
    apiKey: process.env.AFFILIATE_API_KEY,
    secretKey: process.env.AFFILIATE_SECRET_KEY,
    typeId: process.env.AFFILIATE_TYPE_ID
  },
  plutx: {
    domain: process.env.PLUTX_DOMAIN,
    format: process.env.PLUTX_FORMAT,
    url: process.env.PLUTX_URL,
    dnsContract: {
      address: process.env.PLUTX_DNS_CONTRACT_ADDRESS,
      userAddAddress: 'userAddAddress',
      userEditAddress: 'userEditAddress',
      userRemoveAddress: 'userRemoveAddress',
      createSubdomain: 'createSubdomain',
    }
  },
  txCreator: {
    host: process.env.TX_CREATOR_HOST,
    ETH: {
      keyId: process.env.ERC20_TX_CREATOR_KEY_ID,
      serviceId: process.env.ERC20_TX_CREATOR_SERVICE_ID,
      index: process.env.ERC20_TX_CREATOR_INDEX,
      testNet: process.env.ERC20_TX_CREATOR_TESTNET,
      fee: process.env.ERC20_ETH_GAS_PRICE,
      gasLimit: process.env.ERC20_ETH_GAS_LIMIT
    }
  },
  plutxUserID: {
    isEnabled: process.env.PLUTX_USERID_IS_ENABLED === 'true',
    isMigrationEnabled: process.env.PLUTX_USERID_IS_MIGRATION_ENABLED === 'true',
    apiUrl: process.env.PLUTX_USERID_API_URL,
    apiKey: process.env.PLUTX_USERID_APP_API_KEY,
    secretKey: process.env.PLUTX_USERID_APP_SECRET_KEY,
  },
  twofaStep: process.env.TWOFA_STEP ? parseInt(process.env.TWOFA_STEP) : 3,
  membership: {
    KYCLevelAllowPurchase: process.env.MEMBERSHIP_KYC_LEVEL_ALLOW_PURCHASE,
    countryWhitelist: process.env.MEMBERSHIP_COUNTRY_WHITELIST,
    typeId: process.env.MEMBERSHIP_AFFILIATE_TYPE_ID,
    receivingRewardPlatform: process.env.MEMBERSHIP_RECEIVING_REWARD_PLATFROM ? process.env.MEMBERSHIP_RECEIVING_REWARD_PLATFROM.split(",") : ['USDT'],
    referralUrl: process.env.MEMBERSHIP_REFERRAL_URL + '/sign-up?ref='
  },
  setting: {
    USD_RATE_BY_JPY: "USD_RATE_BY_JPY",
    USD_RATE_BY_: "USD_RATE_BY_",
    MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT: "MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT",
    CLAIM_AFFILIATE_REWARD_: "CLAIM_AFFILIATE_REWARD_",
    CLAIM_AFFILIATE_REWARD_ATOM: "CLAIM_AFFILIATE_REWARD_ATOM",
    CLAIM_AFFILIATE_REWARD_IRIS: "CLAIM_AFFILIATE_REWARD_IRIS",
    CLAIM_AFFILIATE_REWARD_ONG: "CLAIM_AFFILIATE_REWARD_ONG",
    CLAIM_AFFILIATE_REWARD_XTZ: "CLAIM_AFFILIATE_REWARD_XTZ",
    CLAIM_AFFILIATE_REWARD_ONE: "CLAIM_AFFILIATE_REWARD_ONE",
    CLAIM_AFFILIATE_REWARD_ATOM_NETWORK_FEE: "CLAIM_AFFILIATE_REWARD_ATOM_NETWORK_FEE",
    CLAIM_AFFILIATE_REWARD_IRIS_NETWORK_FEE: "CLAIM_AFFILIATE_REWARD_IRIS_NETWORK_FEE",
    CLAIM_AFFILIATE_REWARD_ONG_NETWORK_FEE: "CLAIM_AFFILIATE_REWARD_ONG_NETWORK_FEE",
    CLAIM_AFFILIATE_REWARD_XTZ_NETWORK_FEE: "CLAIM_AFFILIATE_REWARD_XTZ_NETWORK_FEE",
    CLAIM_AFFILIATE_REWARD_ONE_NETWORK_FEE: "CLAIM_AFFILIATE_REWARD_ONE_NETWORK_FEE",
    MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE: "MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE",
    MS_POINT_MODE: "MS_POINT_MODE",
    MS_POINT_CLAIMING_IS_ENABLED: "MS_POINT_CLAIMING_IS_ENABLED",
    MS_POINT_DELAY_TIME_IN_SECONDS: "MS_POINT_DELAY_TIME_IN_SECONDS",
    MS_POINT_DELAY_TIME_DURATION: "MS_POINT_DELAY_TIME_DURATION",
    MS_POINT_STAKING_IS_ENABLED: "MS_POINT_STAKING_IS_ENABLED",
    MS_POINT_EXCHANGE_IS_ENABLED: "MS_POINT_EXCHANGE_IS_ENABLED",
    MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED: "MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED",
    MS_POINT_SURVEY_IS_ENABLED: "MS_POINT_SURVEY_IS_ENABLED",
  },
  apiKeyIP: process.env.API_IP_KEY || '',
  bodyTransferLimit: process.env.BODY_TRANSFER_LIMIT || '5mb',
  exchange: {
    changelly: {
      url: process.env.CHANGELLY_URL,
      apiKey: process.env.CHANGELLY_API_KEY,
      secretKey: process.env.CHANGELLY_API_SECRET
    }
  },
  cacheDurationTime: process.env.CACHE_DURATION_TIME || 10,
  webWallet: {
    apiUrl: process.env.WEB_WALLET_API_URL || "https://dev-staking-wallet-web.chainservices.info",
    trackingEmailApiToken: process.env.WEB_WALLET_TRACKING_EMAIL_API_TOKEN,
  },
  fiat: {
    wyre: {
      url: process.env.WYRE_URL,
      apiKey: process.env.WYRE_API_KEY,
      secretKey: process.env.WYRE_SECRET_KEY,
      accountId: process.env.WYRE_ACCOUNT_ID
    }
  },
  banking: {
    nexo: {
      usingIBP: process.env.NEXO_USING_IBP == "1",
      url: process.env.NEXO_URL,
      apiKey: process.env.NEXO_API_KEY,
    }
  },
  hangoutError: {
    isEnabled: process.env.HANGOUT_ERROR_IS_ENABLED === 'true',
    logLevel: process.env.HANGOUT_ERROR_LOG_LEVEL || 'error',
    webhookUrl: process.env.HANGOUT_ERROR_CHANEL_WEBHOOK_URL,
  },
  whitelistReCaptcha: process.env.WHITELIST_RECAPTCHA ? process.env.WHITELIST_RECAPTCHA.split(',') : [],
  dotWss: process.env.DOT_WSS,
  dotEraPeriod: parseInt(process.env.DOT_ERA_PERIOD || '2'),
};

module.exports = config;
