const logger = require('app/lib/logger');
const config = require('app/config');
const redis = require("app/lib/redis");
const cache = redis.client();
const redisResource = require("app/resource/redis");
const Polkadot = require('app/lib/polkadot');
const __CACHE_TIME_REWARD__ = 60 * 60 * 48;

module.exports = {
  reward: async (req, res, next) => {
    try {
      const address = req.params.address;
      const checkAddress = Polkadot.checkAddress(address);
      if (!checkAddress) {
        return res.badRequest(res.__('ADDRESS_INVALID'), 'ADDRESS_INVALID');
      }

      let currentEra = await _getCurrentEra();
      const keyReward = redisResource.polkadot.reward.withParams(address, currentEra);
      const reward = await cache.getAsync(keyReward);
      let eras = [];
      if (reward != null && parseFloat(reward) == 0) {
        return res.ok({
          reward: 0,
          eras: []
        });
      }

      const keyEra = redisResource.polkadot.eras.withParams(address);
      const eraResult = await cache.getAsync(keyEra);
      if (eraResult) {
        eras = JSON.parse(eraResult);
        if (reward == null && eras.indexOf(currentEra - 1) == -1) {
          eras.push(currentEra - 1);
        }
      }
      else {
        let i = 0;
        eras = Array.from(Array(84), () => {
          i++;
          return currentEra - i;
        });
      }
      let result = await _getRewards(address, eras, currentEra);
      await cache.setAsync(keyReward, result.reward, "EX", __CACHE_TIME_REWARD__);
      let eraValid = result.eras.map(x => x.era);
      await cache.setAsync(keyEra, JSON.stringify(eraValid));
      return res.ok(result);
    }
    catch (err) {
      console.log('err', err)
      logger.error("get polkadot rewards fail: ", err);
      next(err);
    }
  }
}

async function _getRewards(assress, eras, currentEra) {
  let res = [];
  let total = 0;
  let eraValid = []
  for (let i of eras) {
    if (currentEra - i <= 84) {
      eraValid.push(i);
    }
  }
  let response = await Polkadot.getRewardsEra(assress, eraValid);
  for (let i of response) {
    if (i) {
      if (i.rewards.length > 0) {
        total += i.rewards.reduce((s, t) => {
          return s + t.value;
        }, 0);
      }
      res.push({
        era: parseFloat(i.era),
        rewards: i.rewards
      });
    }
  }

  return {
    reward: total,
    eras: res
  }
}


async function _getCurrentEra() {
  const key = redisResource.polkadot.currentEra;
  let currentEra = await cache.getAsync(key);
  if (!currentEra) {
    let eraActive = await Polkadot.activeEra();
    currentEra = eraActive.index;
    const today = Date.now();
    const endEra = eraActive.start + (config.dotEraPeriod * 1000);
    const cacheTime = Math.floor((endEra - today) / 1000);
    if (cacheTime > 0) {
      await cache.setAsync(key, currentEra, "EX", cacheTime);
    }
  }
  return parseFloat(currentEra);
}