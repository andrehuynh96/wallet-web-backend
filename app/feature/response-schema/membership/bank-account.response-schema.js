const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].currency_symbol': '[].currency_symbol?',
    '[].account_number': '[].account_number?',
	'[].branch_name': '[].branch_name?',
    '[].bank_name': '[].bank_name?',
    '[].swift': '[].swift?',
    '[].account_name': '[].account_name?'
  },
  single: {
    id: 'id',
    currency_symbol: 'currency_symbol?',
    account_number: 'account_number?',
	branch_name: 'branch_name?',
    bank_name: 'bank_name?',
    swift: 'swift?',
    account_name: 'account_name?'
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