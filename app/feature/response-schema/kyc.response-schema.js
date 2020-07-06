const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].key': '[].key',
    '[].description': '[].description',
    '[].order_index': '[].order_index',
    '[].prev_level': '[].prev_level',
    '[].have_to_pass_prev_level_flg': '[].have_to_pass_prev_level_flg',
    '[].auto_approve_flg': '[].auto_approve_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
    '[].kyc_properties[].id': '[].kyc_properties[].id',
    '[].kyc_properties[].field_name': '[].kyc_properties[].field_name',
    '[].kyc_properties[].field_key': '[].kyc_properties[].field_key',
    '[].kyc_properties[].description': '[].kyc_properties[].description',
    '[].kyc_properties[].data_type': '[].kyc_properties[].data_type',
    '[].kyc_properties[].member_field': '[].kyc_properties[].member_field',
    '[].kyc_properties[].require_flg': '[].kyc_properties[].require_flg',
    '[].kyc_properties[].check_data_type_flg': '[].kyc_properties[].check_data_type_flg',
    '[].kyc_properties[].order_index': '[].kyc_properties[].order_index',
    '[].kyc_properties[].enabled_flg': '[].kyc_properties[].enabled_flg',
    '[].kyc_properties[].group_name': '[].kyc_properties[].group_name',
    '[].kyc_properties[].createdAt': '[].kyc_properties[].created_at',
    '[].kyc_properties[].updatedAt': '[].kyc_properties[].updated_at'
  },
  single: {
    id: 'id',
    name: 'name',
    key: 'key',
    description: 'description',
    order_index: 'order_index',
    prev_level: 'prev_level',
    have_to_pass_prev_level_flg: 'have_to_pass_prev_level_flg',
    auto_approve_flg: 'auto_approve_flg',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    'kyc_properties[].id': 'kyc_properties[].id',
    'kyc_properties[].field_name': 'kyc_properties[].field_name',
    'kyc_properties[].field_key': 'kyc_properties[].field_key',
    'kyc_properties[].description': 'kyc_properties[].description',
    'kyc_properties[].data_type': 'kyc_properties[].data_type',
    'kyc_properties[].member_field': 'kyc_properties[].member_field',
    'kyc_properties[].require_flg': 'kyc_properties[].require_flg',
    'kyc_properties[].check_data_type_flg': 'kyc_properties[].check_data_type_flg',
    'kyc_properties[].order_index': 'kyc_properties[].order_index',
    'kyc_properties[].enabled_flg': 'kyc_properties[].enabled_flg',
    'kyc_properties[].group_name': 'kyc_properties[].group_name',
    'kyc_properties[].createdAt': 'kyc_properties[].created_at',
    'kyc_properties[].updatedAt': 'kyc_properties[].updated_at'
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