const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { cryptoWaitReady, mnemonicToMiniSecret, checkAddress } = require('@polkadot/util-crypto');
const BigNumber = require('bignumber.js');
const config = require('app/config');
const logger = require('app/lib/logger');
let __WSS_CLIENT__;
const __MAX_ERA_REQ__ = 40;

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

      let validatorEras = [];
      validatorEras[0] = [];
      let ixs = [index];
      if (index.length > __MAX_ERA_REQ__) {
        ixs = [index.slice(0, __MAX_ERA_REQ__), index.slice(__MAX_ERA_REQ__, index.length)]
      }
      for (let i of ixs) {
        const result = await client.derive.staking.stakerRewardsMultiEras([address], i);
        if (result[0].length > 0) {
          validatorEras[0].push(...result[0]);
        }
      }
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
      // await __WSS_CLIENT__.connect();
      __WSS_CLIENT__ = new WsProvider(config.dotWss);
    }
    __WSS_CLIENT__.on('error', (err) => {
      console.log('__WSS_CLIENT__::ERROR', err)
    });
    await api.isReady;
    return api;
  }
  catch (err) {
    throw err;
  }
}