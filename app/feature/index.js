const express = require("express");
const router = express.Router();

router.use(require('./login/login.route'));
router.use(require('./register/register.route'));
router.use(require('./confirm-2fa/confirm-2fa.route'));
router.use(require('./verify-member/verify-member.route'));
router.use(require('./resend-email/resend-email.route'));
router.use(require('./member'));
router.use(require('./set-new-password/set-new-password.route'))
router.use(require('./forgot-password/forgot-password.route'))
router.use(require('./logout/logout.route'));
router.use(require('./get-wallet/get-wallet.route'));
router.use(require('./wallet/wallet.route'));
router.use(require('./wallet/wallet-private-key/wallet-private-key.route'));
router.use(require('./currency/currency.route'));
router.use(require('./kyc/kyc.route'));
router.use(require('./tracking/tracking.route'));
router.use(require('./wallet/wallet-token/wallet-token.route'));
router.use(require('./get-contract-testnet/get-contract-testnet.route'));
router.use(require('./check-token/check-token.route'));
router.use(require('./member-plutx/member-plutx.route'));
router.use('/membership', require('./membership'));
router.use('/staking', require('./staking'));
router.use(require('./static/static.route'));
router.use(require('./validator/validator.route'));
router.use(require('./term-condition/term-condition.route'));
router.use(require('./setting/setting.route'));
router.use(require('./notification/notification.route'));
router.use('/exchange', require('./exchange'));
router.use(require('./email-tracking/email-tracking.route'));
router.use('/asset', require('./get-asset/get-asset.route'));
router.use('/coin-gecko', require('./coin-gecko'));
router.use(require('./point'));
router.use('/fiat', require('./fiat'));
router.use('/nexo', require('./nexo/transaction.route'));
router.use('/bank', require('./bank'));

module.exports = router;

/* *********************************************************************/
/**
 * @swagger
 * definition:
 *   error:
 *     properties:
 *       message:
 *         type: string
 *       error:
 *         type: string
 *       code:
 *         type: string
 *       fields:
 *         type: object
 */

/**
 * @swagger
 * definition:
 *   200:
 *     properties:
 *       data:
 *         type: object
 *     example:
 *       data: true
 *
 */

/**
 * @swagger
 * definition:
 *   400:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Missing parameters
 *           error: error
 *           code: USER_NOT_FOUND
 *           fields: ['email']
 */

/**
 * @swagger
 * definition:
 *   401:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Unauthorized
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   403:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Forbidden
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   404:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Not Found
 *           error: error
 *           code: USER_NOT_FOUND
 */

/**
 * @swagger
 * definition:
 *   500:
 *         properties:
 *           data:
 *             $ref: '#/definitions/error'
 *         example:
 *           message: Server Internal Error
 *           error: error
 *           code: USER_NOT_FOUND
 */
