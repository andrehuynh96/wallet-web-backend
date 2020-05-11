const Model = require('app/model/wallet').currencies;

(async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      symbol: "BTC",
      name: "Bitcoin",
      platform: "BTC",
      order_index: 0,
    }, {
      symbol: "ETH",
      name: "Ethereum",
      platform: "ETH",
      order_index: 1,
    }, {
      symbol: "ATOM",
      name: "Cosmos",
      platform: "ATOM",
      order_index: 2,
    }, {
      symbol: "IRIS",
      name: "Iris",
      platform: "IRIS",
      order_index: 3,
    }, {
      symbol: "XTZ",
      name: "Tezos",
      platform: "XTZ",
      order_index: 4,
    }], {
        returning: true
      });
  }
})();