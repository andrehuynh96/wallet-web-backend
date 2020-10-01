const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].symbol': '[].symbol',
    '[].decimals': '[].decimals',
    '[].icon': '[].icon',
    '[].description': '[].description',
    '[].order_index': '[].order_index',
    '[].type': '[].type',
    '[].platform': '[].platform',
    '[].sc_token_address': '[].sc_token_address',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].default_flg': '[].default_flg',
    '[].status': '[].status'
  },
  single: {
    id: 'id',
    name: 'name',
    symbol: 'symbol',
    decimals: 'decimals',
    icon: 'icon',
    description: 'description',
    order_index: 'order_index',
    type: 'type',
    platform: 'platform',
    sc_token_address: 'sc_token_address',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    default_flg: 'default_flg',
    status: 'status'
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