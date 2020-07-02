const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].bank_account_id': '[].bank_account_id?',
    '[].receiving_addresses_id': '[].receiving_addresses_id?',
    '[].membership_type_id': '[].membership_type_id',
    '[].payment_type': '[].payment_type',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].account_number': '[].account_number?',
    '[].bank_name': '[].bank_name?',
    '[].swift': '[].swift?',
    '[].account_name': '[].account_name?',
    '[].payment_ref_code': '[].payment_ref_code',
    '[].wallet_address': '[].wallet_address?',
    '[].your_wallet_address': '[].your_wallet_address?',
    '[].txid': '[].txid?',
    '[].rate_usd': '[].rate_usd?',
    '[].status': '[].status?',
    '[].created_at': '[].created_at?',
    '[].updated_at': '[].updated_at?',
    '[].membership_type': '[].membership_type',
  },
  single: {
    id: 'id',
    member_id: 'member_id',
    bank_account_id: 'bank_account_id?',
    receiving_addresses_id: 'receiving_addresses_id?',
    membership_type_id: 'membership_type_id',
    payment_type: 'payment_type',
    currency_symbol: 'currency_symbol',
    amount: 'amount',
    amount_usd: 'amount_usd',
    account_number: 'account_number?',
    bank_name: 'bank_name?',
    branch_name: 'branch_name?',
    swift: 'swift?',
    account_name: 'account_name?',
    account_type: 'account_type?',
    payment_ref_code: 'payment_ref_code',
    wallet_address: 'wallet_address?',
    your_wallet_address: 'your_wallet_address?',
    txid: 'txid?',
    rate_usd: 'rate_usd?',
    status: 'status?',
    created_at: 'created_at?',
    updated_at: 'updated_at?',
    membership_type: 'membership_type'
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