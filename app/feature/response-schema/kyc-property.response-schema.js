const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].field_name': '[].field_name',
    '[].field_key': '[].field_key',
    '[].description': '[].description',
    '[].data_type': '[].data_type',
    '[].member_field': '[].member_field',
    '[].require_flg': '[].require_flg',
    '[].check_data_type_flg': '[].check_data_type_flg',
    '[].order_index': '[].order_index',
    '[].enabled_flg': '[].enabled_flg',
    '[].group_name': '[].group_name',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    field_name: 'field_name',
    field_key: 'field_key',
    description: 'description',
    data_type: 'data_type',
    member_field: 'member_field',
    require_flg: 'require_flg',
    check_data_type_flg: 'check_data_type_flg',
    order_index: 'order_index',
    enabled_flg: 'enabled_flg',
    group_name: 'group_name',
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