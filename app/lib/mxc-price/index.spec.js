/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const Index = require("./index");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

describe('Test MXC Price', function () {
  it('Get Price', async () => {
    let result = await Index.getPrice("CPAY");
    console.log(result);
    expect(result).to.be.an('object')
  });
});