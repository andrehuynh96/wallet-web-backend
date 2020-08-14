const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].address': '[].address',
    '[].estimate_earn_per_year': '[].estimate_earn_per_year',
    '[].createdAt': '[].created_at',   
  },
  single: {
    'id': 'id',
    'address': 'address',
    'estimate_earn_per_year': 'estimate_earn_per_year',
    'createdAt': 'created_at'
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