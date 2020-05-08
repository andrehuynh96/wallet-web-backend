const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger")
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

module.exports = {
  register: async ({ email, referrerCode }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.post(`${config.affiliate.url}/clients`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode || ""
        },
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.typeId,
            Authorization: `Bearer ${accessToken}`,
          }
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  },

  UpdateReferrer: async ({ email, referrerCode }) => {
    try {
      let accessToken = await _getToken();
      let result = await axios.put(`${config.affiliate.url}/clients/affiliate-codes`,
        {
          ext_client_id: email,
          affiliate_code: referrerCode
        },
        {
          headers: {
            "x-use-checksum": true,
            "x-secret": config.affiliate.secretKey,
            "Content-Type": "application/json",
            "x-affiliate-type-id": config.affiliate.typeId,
            Authorization: `Bearer ${accessToken}`,
          }
        });
      return { httpCode: 200, data: result.data };

    }
    catch (err) {
      logger.error("create client fail:", err);
      return { httpCode: err.response.status, data: err.response.data };
    }
  }
}

async function _getToken() {
  let token = await cache.getAsync(redisResource.affiliate.token);
  if (token) {
    return token;
  }
  let result = await axios.post(
    `${config.affiliate.url}/auth/token`,
    {
      api_key: config.affiliate.apiKey,
      secret_key: config.affiliate.secretKey,
      grant_type: "client_credentials"
    }
  );

  await cache.setAsync(redisResource.affiliate.token, result.data.data.access_token, "EX", parseInt(result.data.data.expires_in) - 10);
  return result.data.data.access_token;
}