const objectMapper = require('object-mapper');

const destObject = {
  single: {
    "id": "id",
    "name": "name",
    "content": "content",
    "start_date": "start_date",
    "end_date": "end_date",
    "actived_flg": "actived_flg",
    "description": "description",
    "point": "point",
    "estimate_time": "estimate_time",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
}; 