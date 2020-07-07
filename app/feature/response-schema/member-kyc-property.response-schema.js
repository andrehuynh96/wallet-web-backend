const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].field_name': '[].field_name',
    '[].field_key': '[].field_key',
    '[].value': '[].value',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    field_name: 'field_name',
    field_key: 'field_key',
    value: 'value',
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