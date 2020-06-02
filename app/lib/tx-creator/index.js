const axios = require('axios');
const config = require('app/config');
module.exports = {
  getAddress: async (platform = 'ETH') => {
    try {
      let result = await axios.get(
        `${config.txCreator.host}/api/sign/${config.txCreator[platform].keyId}/${platform}/address/${config.txCreator[platform].index}`, {
        params: {
          testnet: config.txCreator[platform].testNet
        }
      }
      );
      return result.data.data.address;
    } catch (err) {
      throw err;
    }
  },
  sign: async (data, platform = 'ETH') => {
    try {
      let result = await axios.post(
        `${config.txCreator.host}/api/sign/${config.txCreator[platform].serviceId}/${config.txCreator[platform].keyId}/${platform}/address/${config.txCreator[platform].index}`,
        data,
        {
          headers: {
            "Content-Type": "application/json"
          },
          params: {
            testnet: config.txCreator[platform].testNet
          }
        }
      );
      return result.data.data;
    } catch (err) {
      throw err;
    }
  },
};
