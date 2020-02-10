const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].default_flg': '[].default_flg',
    '[].key_store_path': '[].key_store_path',
    '[].createdAt': '[].created_at'
  },
  single: {
    id: 'id',
    default_flg: 'default_flg',
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