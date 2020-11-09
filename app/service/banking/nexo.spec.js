/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const sleep = require('sleep-promise');
const redis = require('app/lib/redis');
const NEXO = require("./nexo");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

let instance;
const nexoId = '5fa8b7e9bcf58e63ce0d87f0';
const secret = '4e9db926c2444b7c5fb86e50583b271dc765cf93a76b9a3fdfd88f5b83e62ba74ca5c3b711616216e51b068b1a8e51b5f75a4eeafac3e76c90f942bb0e475473'
const VerifyCode = '14521283';
const nexoEmail = "huyht+1604892647537@blockchainlabs.asia"

describe('Test NEXO', function () {
  beforeEach(async () => {
    redis.init(async err => {
    });
    await sleep(2000);
    instance = new NEXO({ ibp: true });
  });

  it('Create account', async () => {
    let time = Date.now()
    let email = `huyht+${time}@blockchainlabs.asia`;
    let result = await instance.createAccount({
      first_name: "Huy",
      last_name: "Hoang",
      email: email
    });
    console.log({ email, ...result });
    result.should.have.property('id');
    result.should.have.property('secret');
  });

  it('Verify account', async () => {
    let result = await instance.verifyEmail({
      nexo_id: nexoId,
      code: VerifyCode,
      secret: secret
    });
    console.log('Verify account::', result);
  });

  it.only('requestRecoveryCode account', async () => {
    let result = await instance.requestRecoveryCode({
      email: nexoEmail
    });
    console.log('requestRecoveryCode account::', result)
  });
});