const objectMapper = require('object-mapper');

const destObject = {
  single: {
    member_id: 'member_id',
    member_account_id: 'id?',
    currency_symbol: 'currency_symbol?',
    account_number: 'account_number?',
    bank_name: 'bank_name?',
    branch_name: 'branch_name?',
    account_holder: 'account_holder?',
    wallet_address: 'wallet_address?'
  }
};
module.exports = srcObject => {
    return objectMapper(srcObject, destObject.single);
}; 