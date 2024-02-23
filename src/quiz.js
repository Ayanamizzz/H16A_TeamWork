
// QuizList
// Provide a list of all quizzes that are owned by the currently logged in user.
function adminQuizList(authUserId) {
    quizzes: [
        {
          quizId: 1,
          name: 'My Quiz',
        }
    ]
}
  


//stub for the adminQuizInfo
//Get all of the relevant information about the current quiz.
function adminQuizInfo (authUserId, quizId) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    }
}


