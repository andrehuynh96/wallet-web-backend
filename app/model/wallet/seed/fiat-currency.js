const Model = require('app/model/wallet').fiat_currencies;
const Status = require('app/model/wallet/value-object/currency-status');

module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      symbol: "USD",
      name: "United States Dollars",
      order_index: 0,
      status: Status.ENABLED
    }, {
      symbol: "GBP",
      name: "British Pound Sterling",
      order_index: 1,
      status: Status.ENABLED
    }, {
      symbol: "EUR",
      name: "Euro",
      order_index: 2,
      status: Status.ENABLED
    }, {
      symbol: "AUD",
      name: "Australian Dollar",
      order_index: 3,
      status: Status.ENABLED
    }, {
      symbol: "CAD",
      name: "Canadian Dollar",
      order_index: 4,
      status: Status.ENABLED}], {
        returning: true
      });
  }
};