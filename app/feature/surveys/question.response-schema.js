const objectMapper = require('object-mapper');
const answersMapper = require('./answer.response-schema')

const destObject = {
    array: {
        "[].id": "[].id",
        "[].title": "[].title",
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
        "[].updatedAt": "[].updated_at",
        "[].Answers": "[].Answers"
    },
};

module.exports = srcObject => {
    let questions = objectMapper(srcObject, destObject.array);
    for (let i = 0; i < questions.length; i++) {
        questions[i].Answers = answersMapper(questions[i].Answers)
    }
    return questions
};