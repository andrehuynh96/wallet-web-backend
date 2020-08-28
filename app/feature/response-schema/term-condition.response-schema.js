const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].term_no': '[].term_no',
    '[].content': '[].content',
    '[].applied_date': '[].applied_date',
  },
  single: {
    'id': 'id',
    'term_no': 'term_no',
    'content': 'content',
    'applied_date': 'applied_date'
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