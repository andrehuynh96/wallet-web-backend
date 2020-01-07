const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const baseResponse = require('app/lib/inf-base-response');
const config = require('app/config');
const rateLimit = require('express-rate-limit');
const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  directory: path.resolve(__dirname + '/locales'),
});
router.use(i18n.init);

router.use(
  bodyParser.urlencoded({
    limit: '5mb',
    extended: true,
  })
);
router.use(
  bodyParser.json({
    limit: '5mb',
    extended: true,
  })
);

if (config.corsDomain) {
  var allowedOrigins = config.corsDomain.split(',');
  router.use(
    cors({
      credentials: true,
      origin: allowedOrigins,
    })
  );
} else {
  router.use(cors());
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit,
});
router.use(limiter);

router.use(helmet());
router.use(
  express.json({
    limit: '1mb',
    strict: true,
  })
);

router.use(
  baseResponse({
    i18n: true,
  })
);

router.get('/', function (req, res) {
  let result = {
    message: 'Hello',
  };
  res.json(result);
});
router.get('/health', (req, res) => res.send('OK!'));
router.use('/api', require('app/feature'));

router.use(function (req, res) {
  res.notFound('Not Found');
});

router.use((err, req, res, next) => {
  console.log(err);
  res.serverInternalError(err.message);
});

module.exports = router;
