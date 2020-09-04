
class Exchange {
  constructor() {

  }

  async getMinAmount(options) {
    throw new Error(`You have to implement getMinAmount function in child class`);
  }

  async estimate(options) {
    throw new Error(`You have to implement estimate function in child class`);
  }

  async makeTransaction(options) {
    throw new Error(`You have to implement makeTransaction function in child class`);
  }

  async getTransaction(options) {
    throw new Error(`You have to implement getTransaction function in child class`);
  }

  async getTransactionDetail(options) {
    throw new Error(`You have to implement getTransactionDetail function in child class`);
  }
}

module.exports = Exchange;