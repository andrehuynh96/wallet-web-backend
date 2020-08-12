const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].name': '[].name',
    '[].platform': '[].platform',
    '[].address': '[].address',
    '[].createdAt': '[].created_at',
    '[].roa': '[].roa',
    '[].size': '[].size',
    '[].bpe': '[].bpe',
    '[].fees': '[].fees',
    '[].fees_avg': '[].fees_avg',
    '[].pledge': '[].pledge',
  },
  single: {
    'id': 'id',
    'name': 'name',
    'platform': 'platform',
    'address': 'address',
    'createdAt': 'created_at',
    'roa': 'roa',
    'size': 'size',
    'bpe': 'bpe',
    'fees': 'fees',
    'fees_avg': 'fees_avg',
    'pledge': 'pledge',
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