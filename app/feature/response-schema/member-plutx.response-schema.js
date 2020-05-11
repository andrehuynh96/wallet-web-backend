const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].domain_name': '[].domain_name',
    '[].member_id': '[].member_id',
    '[].wallet_id': '[].wallet_id',
    '[].member_domain_name': '[].member_domain_name',
    '[].platform': '[].platform',
    '[].address': '[].address',
    '[].active_flg': '[].active_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    domain_id: 'domain_id',
    member_id: 'member_id',
    wallet_id: 'wallet_id',
    platform: 'platform',
    address: 'address',
    active_flg: 'active_flg',
    createdAt: 'created_at',
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