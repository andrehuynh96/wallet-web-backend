const objectMapper = require('object-mapper');
const destObject = {
  array: {
    "[].id": "[].id",
    "[].question_id": "[].question_id",
    "[].text": "[].text",
    "[].text_ja": "[].text_ja",
    "[].createdAt": "[].created_at",
    "[].updatedAt": "[].updated_at"
  },
};

module.exports = srcObject => {
  return objectMapper(srcObject, destObject.array)
};
