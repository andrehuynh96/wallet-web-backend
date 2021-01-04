//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
describe('Register', function() {
  this.timeout(20000);
  /*
    * Test the /POST register
    */
  before((done) => {
    require('../../../server');
    setTimeout(function(){
      done()
    }, 15000)
  });

  describe('/Post register member', () => {
    it('it should register ok', function(done){
      let user = {
        email: "abc123@mailinator.com",
        password: "Abc@123456",
        language: 'en',
        country_phone_code: 'EN'
      }
      chai.request('http://127.0.0.1:3001')
        .post('/web/register')
        .send(user)
        .end((err, res) => {
          console.log(res)
          res.should.have.status(200);
          done();
        });
    });

    it('it should fail', function(done){
      let user = {
        email: "abc123@mailinator.com",
        password: "Abc@123456",
        language: 'en',
        country_phone_code: 'E'
      }
      chai.request('http://127.0.0.1:3001')
        .post('/web/register')
        .send(user)
        .end((err, res) => {
          console.log(res)
          res.should.have.status(200);
          done();
        });
    });

    it.only('it should fail', function(done){
      let user = {
        email: "abc123@mailinator.com",
        password: "Abc@123456",
        language: 'en',
        country_phone_code: ''
      }
      chai.request('http://127.0.0.1:3001')
        .post('/web/register')
        .send(user)
        .end((err, res) => {
          console.log(res)
          res.should.have.status(200);
          done();
        });
    });
  });

});