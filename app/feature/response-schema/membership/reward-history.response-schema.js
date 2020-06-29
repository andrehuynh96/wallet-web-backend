const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].currency_symbol': '[].currency_symbol?',
    '[].amount': '[].amount?'
  },
  single: {
    id: 'id',
    currency_symbol: 'currency_symbol?',
    amount: 'amount?'
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