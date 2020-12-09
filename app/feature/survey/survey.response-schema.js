const objectMapper = require('object-mapper');

const destObject = {
  single: {
    "id": "id",
    "name": "name",
    "name_ja": "name_ja?",
    "content": "content",
    "title": "title",
    "start_date": "start_date",
    "end_date": "end_date",
    "description": "description",
    "status": "status",
    "type": "type",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
};
