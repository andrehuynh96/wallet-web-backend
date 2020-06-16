const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].member_id': '[].member_id',
    '[].bank_account_id': '[].bank_account_id',
    '[].receiving_addresses_id': '[].receiving_addresses_id',
    '[].membership_type_id': '[].membership_type_id',
    '[].payment_type': '[].payment_type',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].account_number': '[].account_number',
    '[].bank_name': '[].bank_name',
    '[].bracnch_name': '[].bracnch_name',
    '[].account_name': '[].account_name',
    '[].payment_ref_code': '[].payment_ref_code',
    '[].wallet_address': '[].wallet_address',
    '[].your_wallet_address': '[].your_wallet_address',
    '[].txid': '[].txid',
    '[].rate_by_usdt': '[].rate_by_usdt',
    '[].status': '[].status',
    '[].processe_date': '[].processe_date'
  },
  single: {
    id: 'id',
    member_id: 'member_id',
    bank_account_id: 'bank_account_id',
    receiving_addresses_id: 'receiving_addresses_id',
    membership_type_id: 'membership_type_id',
    payment_type: 'payment_type',
    currency_symbol: 'currency_symbol',
    amount: 'amount',
    account_number: 'account_number',
    bank_name: 'bank_name',
    bracnch_name: 'bracnch_name',
    account_name: 'account_holder',
    payment_ref_code: 'payment_ref_code',
    wallet_address: 'wallet_address',
    your_wallet_address: 'your_wallet_address',
    txid: 'txid',
    rate_by_usdt: 'rate_by_usdt',
    status: 'status',
    processe_date: 'processe_date'
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