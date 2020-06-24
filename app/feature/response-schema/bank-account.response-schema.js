const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].currency_symbol': '[].currency_symbol',
    '[].member_id': '[].member_id',
    '[].bank_name': '[].bank_name',
    '[].branch_name': '[].branch_name',
    '[].account_holder': '[].account_holder',
    '[].account_number': '[].account_number',
    '[].account_address': '[].account_address',
    '[].swift': '[].swift',
    '[].default_flg': '[].default_flg'
  },
  single: {
    id: 'id',
    currency_symbol: 'currency_symbol',
    member_id: 'member_id',
    bank_name: 'bank_name',
    branch_name: 'branch_name',
    account_holder: 'account_holder',
    account_number: 'account_number',
    account_address: 'account_address',
    swift: 'swift',
    default_flg: 'default_flg'
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