const objectMapper = require('object-mapper');

const destObject = {

  single: {
    member_id:'member_id',
    member_account_id:'member_account_id',
    type:'type',
    status:'status',
    currency_symbol:'currency_symbol',
    platform: 'platform',
    account_number:'account_number',
    bank_name:'bank_name',
    branch_name:'branch_name',
    account_holder:'account_holder',
    wallet_address: 'wallet_address',
    txid: 'txid',
    amount: 'amount',
    affiliate_claim_reward_id: 'affiliate_claim_reward_id'
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
}; 