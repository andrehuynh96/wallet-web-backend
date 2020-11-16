// BTC, ETH, PAX, BUSD, USDT, GUSD, USDC, USDS, DAI
const Model = require('app/model/wallet').fiat_cryptocurrencies;
const Status = require("app/model/wallet/value-object/fiat-currency-status");
module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    await Model.bulkCreate([{
      symbol: "BTC",
      name: "Bitcoin",
      platform: "BTC",
      order_index: 0,
      icon: "https://static.chainservices.info/staking/platforms/btc.png",
      status: Status.ENABLED
    }, {
      symbol: "ETH",
      name: "Ethereum",
      platform: "ETH",
      order_index: 1,
      icon: "https://static.chainservices.info/staking/platforms/eth.png",
      status: Status.ENABLED
    }, {
      symbol: "PAX",
      name: "Paxos Standard",
      platform: "ETH",
      order_index: 2,
      status: Status.ENABLED,
      contract_address: "0x8e870d67f660d95d5be530380d0ec0bd388289e1",
      icon: "https://static.chainservices.info/staking/platforms/pax.png",
      contract_flg: true
    }, {
      symbol: "BUSD",
      name: "Binance USD",
      platform: "ETH",
      order_index: 3,
      status: Status.ENABLED,
      contract_address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      icon: "https://static.chainservices.info/staking/platforms/busd.png",
      contract_flg: true
    }, {
      symbol: "USDT",
      name: "Tether",
      platform: "ETH",
      order_index: 4,
      status: Status.ENABLED,
      contract_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      icon: "https://static.chainservices.info/staking/platforms/usdt.png",
      contract_flg: true
    }, {
      symbol: "GUSD",
      name: "Gemini Dollar",
      platform: "ETH",
      order_index: 5,
      status: Status.ENABLED,
      contract_address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
      icon: "https://static.chainservices.info/staking/platforms/gusd.png",
      contract_flg: true
    }, {
      symbol: "USDC",
      name: "USD Coin",
      platform: "ETH",
      order_index: 6,
      status: Status.ENABLED,
      contract_address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      icon: "https://static.chainservices.info/staking/platforms/usdc.png",
      contract_flg: true
    }, {
      symbol: "USDS",
      name: "StableUSD",
      platform: "ETH",
      order_index: 7,
      status: Status.ENABLED,
      contract_address: "0xa4bdb11dc0a2bec88d24a3aa1e6bb17201112ebe",
      icon: "https://static.chainservices.info/staking/platforms/usds.png",
      contract_flg: true
    }, {
      symbol: "DAI",
      name: "Dai",
      platform: "ETH",
      order_index: 8,
      status: Status.ENABLED,
      contract_address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      icon: "https://static.chainservices.info/staking/platforms/dai.png",
      contract_flg: true
    }], {
        returning: true
      });
  }
};