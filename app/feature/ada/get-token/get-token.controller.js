const config = require('app/config');
const logger = require('app/lib/logger');
const axios = require('axios');

module.exports = {
  search: async (req, res, next) => {
    try {
      const { query } = req;

      let limit = query.limit ? parseInt(query.limit) : 10;
      let offset = query.offset ? parseInt(query.offset) : 0;
      let assetName = query.asset_name ? Buffer.from(query.asset_name, 'utf8').toString('hex') : '';
      let address = query.address || '';
      let result = await axios.post(`${config.adaGraphqlUrl}`,{
        query: `query assets (
          $limit: Int!
          $offset: Int!
          $where: Token_bool_exp
      ) {
          tokens (limit: $limit,offset: $offset, where: $where)  {
            assetId,
            assetName,
            quantity,
            policyId,
            transactionOutput {
              address,
              index,
              txHash,
              value
            }
          }
        }`,
      variables: {
        limit: limit,
        offset: offset,
        where: {
          assetName: assetName ? { '_eq': `\\x${assetName}` } : {},
          transactionOutput: {
            address: address ? { '_like': `%${address}%` } : {}
          }
        }
      }
      },{
        headers: {
          'Content-Type': 'Application/json'
        }
      }
      );
      if(result.data && result.data.data) {
        const tokens = result.data.data.tokens;
        if( tokens.length ) {
          tokens.forEach(item=> {
            item.assetName =  Buffer.from(item.assetName.replace('\\x',''), 'hex').toString('utf8');
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

