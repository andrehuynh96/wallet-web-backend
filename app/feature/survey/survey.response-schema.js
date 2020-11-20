const objectMapper = require('object-mapper');

const destObject = {
  single: {
    "id": "id",
    "name": "name",
    "content": "content",
    "title": "title",
    "start_date": "start_date",
    "end_date": "end_date",
    "description": "description",
    "status": "status",
    "type": "type",
    "silver_membership_point": "silver_membership_point",
    "gold_membership_point": "gold_membership_point",
    "platinum_membership_point": "platinum_membership_point",
    "createdAt": "created_at",
    "updatedAt": "updated_at"
  }
};
module.exports = srcObject => {
  return objectMapper(srcObject, destObject.single);
};
