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

    describe('/forgot-password', () => {
        it('it should set forgot password', (done) => {
            chai.request(server)
                .post('/web/forgot-password')
                .send({
                    email: 'example@gmail.com'
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
