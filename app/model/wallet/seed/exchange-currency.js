const Model = require('app/model/wallet').exchange_currencies;
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');

module.exports = async () => {
  let count = await Model.count();
  if (count == 0) {
    const Service = ExchangeFactory.create(ExchangeProvider.Changelly, {});
    let currencies = await Service.getCurrencies();
    if (currencies && currencies.result && currencies.result.length > 0) {
      currencies = currencies.result.filter(x => x.enabled);
      let result = currencies.map(x => {
        return {
          symbol: x.ticker.toUpperCase(),
          platform: (x.contractAddress && x.addressUrl.startsWith("https://etherscan.io")) ? "ETH" : x.ticker.toUpperCase(),
          name: x.fullName,
          icon: x.image,
          contract_address: x.contractAddress,
          from_flg: x.enabledFrom,
          to_flg: x.enabledTo,
          fix_rate_flg: x.fixRateEnabled,
        }
      });
      await Model.bulkCreate(result, {
        returning: true
      });
    }
  }
};