const _ = require('lodash');
const config = require("app/config");
const axios = require("axios");
const logger = require("app/lib/logger");
const redisResource = require("app/resource/redis");
const redis = require("app/lib/redis");
const cache = redis.client();

const API_URL = config.plutxUserID.apiUrl;
// eslint-disable-next-line no-unused-vars
let rootOrgUnitId = null;

const PluTXUserIdApi = {
  importUser: async ({ email, password, createdAt, updatedAt, emailConfirmed, isActived }) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.post(`${API_URL}/api/v1/users/import`,
        {
          email,
          password,
          created_at: createdAt,
          updated_at: updatedAt,
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
  register: async ({ email, password, createdAt, emailConfirmed, isActived }) => {
    try {
      const accessToken = await _getAccessToken();
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
      const accessToken = await _getAccessToken();
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
  login: async (email, password) => {
    try {
      const result = await axios.post(`${API_URL}/api/v1/auth/token`,
        {
          grant_type: "password",
          email,
          password,
          api_key: config.plutxUserID.apiKey,
          secret_key: config.plutxUserID.secretKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Login fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  forgotPassword: async (userId, data) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.post(`${API_URL}/api/v1/users/${userId}/forgot-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Forgot password fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  resetPassword: async (token, password) => {
    try {
      const result = await axios.post(`${API_URL}/api/v1/account/reset-password`,
        {
          password,
          token: PluTXUserIdApi.trimToken(token),
          api_key: config.plutxUserID.apiKey,
          secret_key: config.plutxUserID.secretKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Set new password fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const accessToken = await _getAccessToken();
      const result = await axios.put(`${API_URL}/api/v1/users/${userId}/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
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
      logger.error("Change password fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  getToken: async (token) => {
    try {
      token = PluTXUserIdApi.trimToken(token, 'userid-');

      const result = await axios.get(`${API_URL}/api/v1/tokens/${token}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Get token", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  createSsoToken: async (userId, refreshToken) => {
    try {
      const result = await axios.post(`${API_URL}/api/v1/auth/sso-token`,
        {
          refresh_token: refreshToken,
          api_key: config.plutxUserID.apiKey,
          secret_key: config.plutxUserID.secretKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Create SSO token:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  loginWithSsoToken: async (token) => {
    try {
      const result = await axios.post(`${API_URL}/api/v1/auth/token`,
        {
          grant_type: "sso_token",
          token,
          api_key: config.plutxUserID.apiKey,
          secret_key: config.plutxUserID.secretKey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        });

      return { httpCode: 200, data: result.data.data };
    }
    catch (err) {
      logger.error("Login fail:", err);

      return { httpCode: err.response.status, data: err.response.data };
    }
  },
  // Private functions
  trimToken(token) {
    return _.trimEnd(token, 'userid-');
  },

};

async function _getAccessToken() {
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

  const expiredTime = Math.max(data.expires_in - 3, 1);
  await cache.setAsync(key, accessToken, "EX", expiredTime);

  return accessToken;
}

module.exports = PluTXUserIdApi;
