const config = require('app/config');
const logger = require("app/lib/logger");
const InfinitoApi = require("node-infinito-api");

module.exports = {
  addAddresses: async (platform, addresses) => {
    try {
      if (!platform || !addresses) {
        return false;
      }

      const opts = {
        apiKey: config.sdk.apiKey,
        secret: config.sdk.secretKey,
        baseUrl: config.sdk.baseUrl
      };
      const api = new InfinitoApi(opts);
      const webhookAPI = api.getWebhookService().Webhook;
      let events = await webhookAPI.getWebhookEvents();
      if (!events || !events.data || events.data.length == 0) {
        return false;
      }

      let event = events.data.filter(x => x.event.platform == platform && x.event.type == "ADDRESS" && !x.event.have_smart_contract);
      if (!event) {
        return false;
      }
      event = event[0];
      if (!Array.isArray(addresses)) {
        addresses = [addresses];
      }
      await webhookAPI.addAddrsOfUserEvent(event.user_event_id, {
        addresses: addresses
      })
      return true;
    } catch (err) {
      logger.error('webhook addAddresses fail:', err);
      return false;
    }
  },
  removeAddresses: async (platform, addresses) => {
    try {
      if (!platform || !addresses) {
        return false;
      }

      const opts = {
        apiKey: config.sdk.apiKey,
        secret: config.sdk.secretKey,
        baseUrl: config.sdk.baseUrl
      };
      const api = new InfinitoApi(opts);
      const webhookAPI = api.getWebhookService().Webhook;
      let events = await webhookAPI.getWebhookEvents();
      if (!events || !events.data || events.data.length == 0) {
        return false;
      }

      let event = events.data.filter(x => x.event.platform == platform && x.event.type == "ADDRESS" && !x.event.have_smart_contract);
      if (!event) {
        return false;
      }
      event = event[0];
      if (!Array.isArray(addresses)) {
        addresses = [addresses];
      }
      await webhookAPI.deleteAddrsOfUserEvent(event.user_event_id, {
        addresses: addresses
      })
      return true;
    } catch (err) {
      logger.error('webhook removeAddresses fail:', err);
      return false;
    }
  },
}; 