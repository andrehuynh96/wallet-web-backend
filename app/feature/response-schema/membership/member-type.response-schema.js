const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].price': '[].price',
    '[].type': '[].type',
    '[].display_order': '[].display_order'
  },
  single: {
    id: 'id',
    name: 'name',
    price: 'price',
    type: 'type',
    display_order: 'display_order'
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