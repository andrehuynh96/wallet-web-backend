const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { cryptoWaitReady, mnemonicToMiniSecret, checkAddress } = require('@polkadot/util-crypto');
const BigNumber = require('bignumber.js');
const config = require('app/config');
const logger = require('app/lib/logger');
let __WSS_CLIENT__;

module.exports = {
  checkAddress: (address) => {
    try {
      let result = checkAddress(address, 0);
      if (!result[0]) {
        result = checkAddress(address, 42);
      }
      return result[0];
    }
    catch (err) {
      console.log(err);
      logger.error('DOT currentEra failed::', err);
    }
  },

  activeEra: async () => {
    try {
      const client = await _getWssClient();
      let active = await client.query.staking.activeEra();
      return JSON.parse(active.unwrap());
    }
    catch (err) {
      logger.error('DOT activeEra failed::', err);
    }
  },

  getRewardsEra: async (address, eras) => {
    try {
      const client = await _getWssClient();
      let index = eras.map(x => client.createType('EraIndex', x));
      const validatorEras = await client.derive.staking.stakerRewardsMultiEras([address], index);
      validatorEras[0].map(e => {
        e.era = e.era.toString();
        e.eraReward = e.eraReward.toString();
        const stashIds = Object.keys(e.validators);
        let rewards = [];
        stashIds.forEach(s => {
          let x = {
            validator: s,
            value: BigNumber(e.validators[s].value.toString()).toNumber()
          }
          rewards.push(x);
        })
        e.rewards = rewards;
      })
      return validatorEras[0];
    }
    catch (err) {
      logger.error('DOT getRewardsEra failed::', err);
    }
  }
}

async function _getWssClient() {
  try {
    if (!__WSS_CLIENT__) {
      __WSS_CLIENT__ = new WsProvider(config.dotWss);
    }
    const api = await ApiPromise.create({ provider: __WSS_CLIENT__ });
    let isConnected = await api.isConnected;
    if (!isConnected) {
      __WSS_CLIENT__ = new WsProvider(config.dotWss);
    }
    await api.isReady;
    return api;
  }
  catch (err) {
    throw err;
  }
}