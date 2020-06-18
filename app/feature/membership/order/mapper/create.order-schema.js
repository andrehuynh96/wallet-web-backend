const objectMapper = require('object-mapper');

const destObject = {

  single: {
    member_id:'member_id',
    bank_account_id:'bank_account_id',
    receiving_addresses_id:'receiving_addresses_id',
    membership_type_id:'membership_type_id',
    payment_type:'payment_type',
    currency_symbol:'currency_symbol',
    amount:'amount',
    account_number:'account_number',
    bank_name:'bank_name',
    branch_name:'branch_name',
    account_name:'account_name',
    payment_ref_code: 'payment_ref_code',
    status: 'status',
    processe_date:'processe_date',
    referral_code: 'referral_code',
    referrer_code: 'referrer_code',
    order_no: 'order_no',
    rate_by_usdt: 'rate_by_usdt'
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
}; 