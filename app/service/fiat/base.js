
class Fiat {
  constructor() {
  }

  async getCurrencies(options) {
    throw new Error(`You have to implement getCurrencies function in child class`);
  }

  async getCryptoCurrencies(options) {
    throw new Error(`You have to implement getCurrencies function in child class`);
  }

  async getCountries(options) {
    throw new Error(`You have to implement getCurrencies function in child class`);
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

  async getOrder(options) {
    throw new Error(`You have to implement getOrder function in child class`);
  }

}

module.exports = Fiat;