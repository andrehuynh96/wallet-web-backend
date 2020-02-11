let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();

chai.use(chaiHttp);

describe('web wallet', function () {
    this.timeout(5000);
    beforeEach((done) => {
        setTimeout(done, 3000)
    });

    describe('/wallets', () => {
        it('it should set wallets', (done) => {
            chai.request(server)
                .get('/web/wallets')
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
})
