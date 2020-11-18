const objectMapper = require('object-mapper');

const destObject = {
  single: {
    "id":"id",
    "name":"name",
    "content":"content",
    "start_date":"start_date",
    "end_date":"end_date",
    "activated_flg":"activated_flg",
    "description":"description",
    "point":"point",
    "estimate_time":"estimate_time",
    "deleted_flg":"deleted_flg",
    "created_by":"created_by",
    "updated_by":"updated_by",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
}; 