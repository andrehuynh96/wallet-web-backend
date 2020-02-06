const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].email': '[].email',
    '[].twofa_secret': '[].twofa_secret',
    '[].twofa_enable_flg': '[].twofa_enable_flg',
    '[].created_at': '[].created_at',
    '[].member_sts': '[].user_sts'
  },
  single: {
    id: 'id',
    email: 'email',
    twofa_secret: 'twofa_secret',
    twofa_enable_flg: 'twofa_enable_flg',
    created_at: 'created_at',
    member_sts: 'user_sts'
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