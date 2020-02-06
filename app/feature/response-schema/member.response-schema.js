const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].twofa_secret': '[].twofa_secret',
    '[].twofa_enable_flg': '[].twofa_enable_flg',
    '[].created_at': '[].created_at',
    '[].member_sts': '[].member_sts',
    '[].fullname': '[].fullname',
    '[].phone': '[].phone',
    '[].date_of_birth': '[].date_of_birth',
    '[].address': '[].address',
    '[].city': '[].city',
    '[].post_code': '[].post_code',
    '[].country': '[].country',
    '[].referral_code': '[].referral_code',
    '[].referrer_code': '[].referrer_code',
    '[].infinito_id': '[].infinito_id',
  },
  single: {
    id: 'id',
    email: 'email',
    twofa_secret: 'twofa_secret',
    twofa_enable_flg: 'twofa_enable_flg',
    created_at: 'created_at',
    member_sts: 'member_sts',
    fullname: 'fullname',
    phone: 'phone',
    date_of_birth: 'date_of_birth',
    address: 'address',
    city: 'city',
    post_code: 'post_code',
    country: 'country',
    referral_code: 'referral_code',
    referrer_code: 'referrer_code',
    infinito_id: 'infinito_id',
  }
};
module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 