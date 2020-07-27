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
const redis = require('app/lib/redis').client();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const baseUrl = require('app/lib/cdn/base-url');

i18n.configure({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  directory: path.resolve(__dirname + '/locales'),
});
router.use(i18n.init);
router.use(session({
  key: 'sid',
  secret: 'secret-session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // 1 hour
    path: '/',
    secure: false,
    httpOnly: false
  },
  store: new redisStore({ client: redis }),
}))

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Allow-Origin', '*');
  next();
});

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
  baseResponse({
    i18n: true,
  })
);

router.use((req, res, next) => {
  req.baseurl = req.protocol + "://" + req.headers.host;
  baseUrl.setBaseUrl(req.baseurl);
  next();
});

router.use(cookieParser());
// router.use(require('./proxy'));
router.use(
  express.json({
    limit: '1mb',
    strict: true,
  })
);
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

router.get('/', function (req, res) {
  let result = {
    message: 'Hello',
  };
  res.json(result);
});
router.get('/health', (req, res) => res.send('OK!'));
require('app/config/swagger')(router, '/web');
router.use('/web', require('app/feature'));
router.use('/api', require('app/feature/api'));

router.use(function (req, res) {
  res.notFound('Not Found');
});

router.use((err, req, res, next) => {
  console.log(err);
  res.serverInternalError(err.message);
});

module.exports = router;
