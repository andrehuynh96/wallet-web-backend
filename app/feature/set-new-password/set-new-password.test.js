let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();

chai.use(chaiHttp);

describe('staking plan', function () {
    this.timeout(5000);
    beforeEach((done) => {
        setTimeout(done, 3000)
    });

    describe('/set-new-password', () => {
        it('it should set new password', (done) => {
            chai.request(server)
                .post('/web/set-new-password')
                .send({
                    verify_token: 'ZTY2NWMxZGItNjI1Yi00NTI3LWI2ZTMtZWUwNDhkYTdmOGJm',
                    password: '123a123'
                })
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
})
