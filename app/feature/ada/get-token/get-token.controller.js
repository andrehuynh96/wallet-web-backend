const config = require('app/config');
const logger = require('app/lib/logger');
const axios = require('axios');
const AssetFingerprint = require('@emurgo/cip14-js').default;
module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;

      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;
      let assetName = query.asset_name ? Buffer.from(query.asset_name, 'utf8').toString('hex') : '';
      let policyId = query.policy_id || '';
      let result = await axios.post(`${config.adaGraphqlUrl}`, {
        query: `query assets (
          $limit: Int!
          $offset: Int!
          $where: Token_bool_exp,
      ) {
          tokens ( distinct_on: assetId, limit: $limit,offset: $offset, where: $where, order_by: { assetId: asc })  {
            assetId,
            assetName,
            quantity,
            policyId
          }
        }`,
        variables: {
          limit: limit,
          offset: offset,
          where: {
            assetName: assetName ? { '_eq': `\\x${assetName}` } : {},
            policyId: policyId ? { '_eq': `${policyId}` } : {}
          }
        }
      }, {
        headers: {
          'Content-Type': 'Application/json'
        }
      }
      );
      if (result.data && result.data.data) {
        const tokens = result.data.data.tokens;
        if (tokens.length) {
          tokens.forEach(item => {
            item.assetName = Buffer.from(item.assetName.replace('\\x', ''), 'hex').toString('utf8');
            const assetFingerprint = new AssetFingerprint(Buffer.from(item.policyId, 'hex'), Buffer.from(item.assetName));
            item.fingerprint = assetFingerprint.fingerprint();
          });
        }
        return res.ok(tokens);
      }
      return res.ok([]);
    }
    catch (error) {
      logger.error('ADA:: get list token fail', error);
      next(error);
    }
  }
};

