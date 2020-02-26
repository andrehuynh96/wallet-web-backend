const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].symbol': '[].symbol',
    '[].icon': '[].icon',
    '[].description': '[].description',
    '[].order_index': '[].order_index',
    '[].staking_type': '[].staking_type',
    '[].sc_lookup_addr': '[].sc_lookup_addr',
    '[].sc_token_address': '[].sc_token_address',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    name: 'name',
    symbol: 'symbol',
    icon: 'icon',
    description: 'description',
    order_index: 'order_index',
    staking_type: 'staking_type',
    sc_lookup_addr: 'sc_lookup_addr',
    sc_token_address: 'sc_token_address',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 