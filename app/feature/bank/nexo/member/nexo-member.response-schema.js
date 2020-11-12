const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].first_name': '[].first_name',
    '[].last_name': '[].last_name',
    '[].nexo_id': '[].nexo_id',
    '[].status': '[].status',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    email: 'email',
    first_name: 'first_name',
    last_name: 'last_name',
    nexo_id: 'nexo_id',
    status: 'status',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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
