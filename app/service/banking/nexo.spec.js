/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const NEXO = require("./nexo");
const chai = require('chai');
chai.should();

let instance;
const nexoId = '5fa3a62daeb8a8263663f293';
const secret = '854e3aa6aa2da83457eb4c91da4058bebdbeaa7aef9dfc13080cf0b41352a8dd03534c12f3fd3a2d6181e5b6e3c9cfa62ebcc2d47b5112510cfbe89baf3efd10'
const VerifyCode = '99410720';

describe('Test NEXO', function () {
  beforeEach(async () => {
    instance = new NEXO({ ibp: true });
  });

  it('Create account', async () => {
    let time = Date.now()
    let result = await instance.createAccount({
      first_name: "Huy",
      last_name: "Hoang",
      email: `huyht+${time}@blockchainlabs.asia`
    });
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