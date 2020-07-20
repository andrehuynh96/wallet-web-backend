const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].Kyc.name': '[].name',
    '[].Kyc.key': '[].key',
    '[].Kyc.description': '[].description',
    '[].Kyc.order_index': '[].order_index',
    '[].Kyc.prev_level': '[].prev_level',
    '[].status': '[].status',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    'Kyc.name': 'name',
    'Kyc.key': 'key',
    'Kyc.description': 'description',
    'Kyc.order_index': 'order_index',
    'Kyc.prev_level': 'prev_level',
    status: 'status',
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