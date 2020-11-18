const objectMapper = require('object-mapper');
const destObject = {
    array: {
        "[].id": "[].id",
        "[].title": "[].title",
        "[].title_ja": "[].title_ja",
        "[].question_type": "[].question_type",
        "[].category_type": "[].category_type",
        "[].points": "[].points",
        "[].estimate_time": "[].estimate_time",
        "[].forecast_key": "[].forecast_key",
        "[].actived_flg": "[].actived_flg",
        "[].deleted_flg": "[].deleted_flg",
        "[].created_by": "[].created_by",
        "[].updated_by": "[].updated_by",
        "[].survey_id": "[].survey_id",
        "[].sub_type": "[].sub_type",
        "[].createdAt": "[].created_at",
        "[].updatedAt": "[].updated_at"
    },
    single: {
        "id": "id",
        "title": "title",
        "title_ja": "title_ja",
        "question_type": "question_type",
        "category_type": "category_type",
        "points": "points",
        "estimate_time": "estimate_time",
        "forecast_key": "forecast_key",
        "actived_flg": "actived_flg",
        "deleted_flg": "deleted_flg",
        "created_by": "created_by",
        "updated_by": "updated_by",
        "survey_id": "survey_id",
        "sub_type": "sub_type",
        "createdAt": "created_at",
        "updatedAt": "updated_at"
    }
};

module.exports = srcObject => {
    if (Array.isArray(srcObject)) {
        if (srcObject === undefined || srcObject.length == 0) {
            return srcObject;
        }
        else {
            return objectMapper(srcObject, destObject.array)
        }
    }
    else {
        return objectMapper(srcObject, destObject.single)
    }
};