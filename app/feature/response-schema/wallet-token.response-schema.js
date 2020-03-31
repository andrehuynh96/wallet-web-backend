const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].sc_token_address': '[].sc_token_address',
    '[].symbol': '[].symbol',
    '[].name': '[].name',
    '[].decimals': '[].decimals',
    '[].icon': '[].icon',
    '[].createdAt': '[].created_at'
  },
  single: {
    id: 'id',
    platform: 'platform',
    sc_token_address: 'sc_token_address',
    symbol: 'symbol',
    name: 'name',
    decimals: 'decimals',
    icon: 'icon',
    createdAt: 'created_at'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return srcObject;
    } else {
      return objectMapper(srcObject, destObject.array);
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 