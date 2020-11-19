const create = require('./create');
const verify = require('./verify');
const recovery_request = require('./recovery-reqquest');
const recovery_verify = require('./recovery-verify');
const resend_active_code = require('./resend-active-code');

module.exports = {
  create: create,
  verify: verify,
  recovery_request: recovery_request,
  recovery_verify: recovery_verify,
  resend_active_code: resend_active_code
};