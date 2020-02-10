const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].platform': '[].platform',
    '[].address': '[].address',
    '[].hd_path': '[].hd_path',
    '[].key_store_path': '[].key_store_path',
    '[].createdAt': '[].created_at'
  },
  single: {
    id: 'id',
    platform: 'platform',
    address: 'address',
    hd_path: 'hd_path',
    key_store_path: 'key_store_path',
    createdAt: 'created_at'
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