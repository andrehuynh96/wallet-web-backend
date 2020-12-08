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
const nexoId = '5fcf2f0454be8541c325303e';
const secret = 'a4c66730ae672e0205be7835de9ba5235783b51e974646cf4e14e98884a754e8c2122da2fcd6d1db8ea91538e6a6256fe530e584641c2460a73a49ccd2e9a016'
const VerifyCode = '97963846';

// const nexoId = '5fa90d3bde111a217326fc7f';
// const secret = '15466502b28e9f2b619cbc7b1ff61b1a4e5a7be7ac1e59da4987ab41fb43e6a2b39e435b0c85d252e98dd849510cb4fcf028c6696974dffb0dab5123dcff6591'
// const VerifyCode = '68536443';

const nexoEmail = "huyht+1607413506954@blockchainlabs.asia";
const currencyId = 'CLBBE2lr8Gjm'//BTC: 'NXTcJinsNucsB';
const walletAddress = 'mxSb3XcRUURLthzA4GFvzyTu1jK5Uro4kS';

describe('Test NEXO', function () {
  beforeEach(async () => {
    redis.init(async err => {
    });
    await sleep(2000);
    instance = new NEXO({});
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
      code: '58193809'
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
    //   },
    // {
    //   id: 'NXTYMFU8gS7vM',
    //   name: 'USDT',
    //   interest_rate: 8,
    //   interest_earned: '0.00000000',
    //   amount: '0.00000000',
    //   min_earnable: '1',
    //   deposit_enabled: true,
    //   withdraw_enabled: true
    // },
    // ]
  });

  it('getDepositAddress account', async () => {
    let result = await instance.getDepositAddress({
      nexo_id: nexoId,
      secret: secret,
      currency_id: currencyId
    });
    console.log('getDepositAddress::', result);
    result.should.have.property('address');
    result.should.have.property('status');
    // {
    //   status: 'ready',
    //   address: '2N8TDLdRi77SdnRYEcjPyPtyReL3Lq5w6YA',
    //   tag: null,
    //   short_name: 'BTC'
    // }
  });

  it('withdraw account', async () => {
    let result = await instance.withdraw({
      nexo_id: nexoId,
      secret: secret,
      currency_id: currencyId,
      amount: 0.001,
      wallet_address: walletAddress
    });
    console.log('withdraw::', result);
    result.should.have.property('address');
    result.should.have.property('status');
  });

});