const config = require('app/config');
const RewardSystem = require("./index");

let membership = new RewardSystem({
  baseUrl: config.affiliate.url,
  apiKey: config.affiliate.apiKey,
  secretKey: config.affiliate.secretKey,
  typeId: config.membership.typeId
});
module.exports = membership;