const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].currency': '[].currency?',
    '[].amount': '[].amount?'
  },
  single: {
    currency: 'currency?',
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