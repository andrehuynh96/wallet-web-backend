const objectMapper = require('object-mapper');
const destObject = {
  array: {
    '[].id': '[].id',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].status': '[].status',
    '[].action': '[].action',
    '[].tx_id': '[].tx_id',
    '[].description': '[].description',
    '[].system_type': '[].system_type',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    currency_symbol: 'currency_symbol',
    amount: 'amount',
    status: 'status',
    action: 'action',
    tx_id: 'tx_id',
    description: 'description',
    system_type: 'system_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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
