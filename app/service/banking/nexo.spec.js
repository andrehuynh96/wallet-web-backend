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
const nexoId = '5fa8c4b95d23de26301dbbe4';
const secret = 'bc8136a77f720c603ac06b11d3b76efb1bbccc1484915acc56fb5d441b3ffdd9ab9771ff1bc061d32e6be5bb31681c05d6d870694789242fc6815eb86305debd'
const VerifyCode = '36132006';
const nexoEmail = "huyht+1604895928020@blockchainlabs.asia";

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
    assert.typeOf(result, 'array');
  });

  it('requestRecoveryCode account', async () => {
    let result = await instance.requestRecoveryCode({
      email: nexoEmail
    });
    console.log('requestRecoveryCode account::', result);
    assert.typeOf(result, 'array');
  });

  it('verifyRecoveryCode account', async () => {
    let result = await instance.verifyRecoveryCode({
      email: nexoEmail,
      code: '73327107'
    });
    console.log('verifyRecoveryCode account::', result);
    result.should.have.property('id');
    result.should.have.property('secret');
  });

  it('getBalance', async () => {
    let result = await instance.getBalance({
      nexo_id: nexoId,
      secret: secret
    });
    console.log('getBalance::', result);
    // [
    //   {
    //     id: 'NXTcJinsNucsB',
    //     name: 'BTC',
    //     interest_rate: 4,
    //     interest_earned: '0.00000000',
    //     amount: '0.00000000',
    //     min_earnable: '0.001',
    //     deposit_enabled: true,
    //     withdraw_enabled: true
    //   }
    // ]
  });

});