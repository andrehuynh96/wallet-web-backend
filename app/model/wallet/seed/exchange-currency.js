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
          platform: (x.contract_address && x.address_url.startsWith("https://etherscan.io")) ? "ETH" : x.ticker.toUpperCase(),
          name: x.full_name,
          icon: x.image,
          contract_address: x.contract_address,
          from_flg: x.enabled_from,
          to_flg: x.enabled_to,
          fix_rate_flg: x.fix_rate_enabled,
          contract_flg: (x.contract_address && x.address_url.startsWith("https://etherscan.io")) ? true : false,
          fixed_time: x.fixed_time,
        }
      });
      await Model.bulkCreate(result, {
        returning: true
      });
    }
    else {
      for (let x of currencies) {
        await Model.update({
          fixed_time: x.fixed_time
        }, {
            where: {
              symbol: x.ticker.toUpperCase(),
              platform: (x.contract_address && x.address_url.startsWith("https://etherscan.io")) ? "ETH" : x.ticker.toUpperCase(),
            },
          });
      }
    }
  }
};