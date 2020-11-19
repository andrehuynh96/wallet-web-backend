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
    "[].survey_id": "[].survey_id",
    "[].sub_type": "[].sub_type",
    "[].createdAt": "[].created_at",
    "[].updatedAt": "[].updated_at",
    "[].Answers": "[].answers"
  },
};

module.exports = srcObject => {
  let questions = objectMapper(srcObject, destObject.array);
  for (let i = 0; i < questions.length; i++) {
    questions[i].answers = answersMapper(questions[i].answers)
  }
  return questions
};