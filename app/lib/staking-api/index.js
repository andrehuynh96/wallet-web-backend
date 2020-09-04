const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();
const { getToken } = require("./token")

module.exports = {
  getStakingPlatform: async (id) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/platform-votes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data.data;
    }
    catch (err) {
      logger.error("getAllPlatform fail:", err);
      return err.response.data;
    }
  },
  getStakingPlan: async (id) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/erc20/plans/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data.data;
    }
    catch (err) {
      logger.error("getAllStakingPlan fail:", err);
      return err.response.data;
    }
  },
  getValidators: async (platform) => {
    try {
      let accessToken = await getToken();
      let result = await axios.get(`${config.stakingApi.url}/validators-info/${platform}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });

      return result.data.data;
    }
    catch (err) {
      logger.error("getAllStakingPlan fail:", err);
      return err.response.data;
    }
  }
} 
