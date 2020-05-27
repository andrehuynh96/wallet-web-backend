const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

const API_URL = config.plutxUserID.apiUrl;
let rootOrgUnitId = null;

const PluTXUserIdApi = {
  register: async ({ email, password, createdAt, emailConfirmed, isActived }) => {
    try {
      const accessToken = await _getToken();
      const result = await axios.post(`${API_URL}/api/v1/users/register`,
        {
          email,
          password,
          created_at: createdAt,
          email_confirmed_flg: !!emailConfirmed,
          actived_flg: !!isActived,
          org_units: [
            {
              name: "Member",
              is_belong: true
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Register client fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  activeNewUser: async (userId) => {
    try {
      const accessToken = await _getToken();
      const result = await axios.put(`${API_URL}/api/v1/users/${userId}/active-new-user`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Register client fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },

};

async function _getToken() {
  const key = redisResource.plutxUserID.token;
  const token = await cache.getAsync(key);
  if (token) {
    return token;
  }

  const result = await axios.post(
    `${API_URL}/api/v1/auth/token`,
    {
      api_key: config.plutxUserID.apiKey,
      secret_key: config.plutxUserID.secretKey,
      grant_type: "client_credentials"
    }
  );
  const data = result.data.data;
  rootOrgUnitId = data.root_org_unit_id;
  const accessToken = data.access_token;

  await cache.setAsync(key, accessToken, "EX", data.expires_in);

  return accessToken;
}

module.exports = PluTXUserIdApi;
