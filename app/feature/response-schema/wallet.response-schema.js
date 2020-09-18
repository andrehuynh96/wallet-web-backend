const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].default_flg': '[].default_flg',
    '[].order_index': '[].order_index',
    '[].backup_passphrase_flg': '[].backup_passphrase_flg',
    '[].createdAt': '[].created_at'
  },
  single: {
    id: 'id',
    name: 'name',
    default_flg: 'default_flg',
    order_index: 'order_index',
    backup_passphrase_flg: 'backup_passphrase_flg',
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
