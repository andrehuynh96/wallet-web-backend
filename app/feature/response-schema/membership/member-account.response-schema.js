const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].type': '[].type',
    '[].currency_symbol': '[].currency_symbol',
    '[].account_number': '[].account_number',
    '[].bank_name': '[].bank_name',
    '[].branch_name': '[].branch_name',
    '[].account_holder': '[].account_holder',
    '[].wallet_address': '[].wallet_address'
  },
  single: {
    type: 'type',
    currency_symbol: 'currency_symbol',
    account_number: 'account_number',
    bank_name: 'bank_name',
    branch_name: 'branch_name',
    account_holder: 'account_holder',
    wallet_address: 'wallet_address'
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