/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const sleep = require('sleep-promise');
const redis = require('app/lib/redis');
const NEXO = require("./nexo");
const chai = require('chai');
chai.should();

let instance;
const nexoId = '5fa4cc9aaeb8a8263663f2c5';
const secret = '4fdb6be21608c8079aec45217871ef7240b4a3dcdc34595f94dcc9813eb05f98eb8c60105004c541c0a0a8d7187069f0a83f051a9577f6604de21fe0ca4f9896'
const VerifyCode = '70498035';

describe('Test NEXO', function () {
  beforeEach(async () => {
    redis.init(async err => {
    });
    await sleep(2000);
    instance = new NEXO({ ibp: true });
  });

  it('Create account', async () => {
    let time = Date.now()
    let result = await instance.createAccount({
      first_name: "Huy",
      last_name: "Hoang",
      email: `huyht+${time}@blockchainlabs.asia`
    });
    console.log(result);
    result.should.have.property('id');
    result.should.have.property('secret');
  });

  it.only('Verify account', async () => {
    let result = await instance.verifyEmail({
      nexo_id: nexoId,
      code: VerifyCode,
      secret: secret
    });
    console.log('Verify account::', result)
  });
});