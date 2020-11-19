const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].symbol': '[].symbol',
    '[].name': '[].name',
    '[].icon': '[].icon',
    '[].description': '[].description'
  },
  single: {
    'id': 'id',
    'name': 'name',
    'symbol': 'symbol',
    'icon': 'icon',
    'description': 'description'
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
