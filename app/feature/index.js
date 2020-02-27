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


module.exports = router;

/**********************************************************************/
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