const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].interest_rate': '[].interest_rate',
    '[].interest_earned': '[].interest_earned',
    '[].amount': '[].amount',
    '[].min_earnable': '[].min_earnable',
    '[].deposit_enabled': '[].deposit_enabled',
    '[].withdraw_enabled': '[].withdraw_enabled'
  },
  single: {
    'id': 'id',
    'name': 'name',
    'interest_rate': 'interest_rate',
    'interest_earned': 'interest_earned',
    'amount': 'amount',
    'min_earnable': 'min_earnable',
    'deposit_enabled': 'deposit_enabled',
    'withdraw_enabled': 'withdraw_enabled'
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
