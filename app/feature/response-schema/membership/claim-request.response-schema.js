const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].currency_symbol': '[].currency_symbol',
    '[].amount': '[].amount',
    '[].status': '[].status',
    '[].txid': '[].txid',
    '[].wallet_address': '[].wallet_address',
    '[].account_holder': '[].account_holder',
    '[].branch_name': '[].branch_name',
    '[].bank_name': '[].bank_name',
    '[].member_id': '[].member_id',
    '[].member_account_id': '[].member_account_id',
    '[].type': '[].type',
    '[].status': '[].status',
    '[].account_number': '[].account_number',
    '[].affiliate_claim_reward_id': '[].affiliate_claim_reward_id',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    currency_symbol: 'currency_symbol',
    amount: 'amount',
    status: 'status',
    txid: 'txid',
    wallet_address: 'wallet_address',
    account_holder: 'account_holder',
    branch_name: 'branch_name',
    bank_name: 'bank_name',
    member_id: 'member_id',
    member_account_id: 'member_account_id',
    type: 'type',
    status: 'status',
    account_number: 'account_number',
    affiliate_claim_reward_id: 'affiliate_claim_reward_id',
    updatedAt: 'updated_at'
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