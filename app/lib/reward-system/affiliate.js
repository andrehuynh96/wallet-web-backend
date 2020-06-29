const config = require('app/config');
const RewardSystem = require("./index");

let affiliate = new RewardSystem({
  baseUrl: config.affiliate.url,
  apiKey: config.affiliate.apiKey,
  secretKey: config.affiliate.secretKey,
  typeId: config.affiliate.typeId
});
module.exports = affiliate;