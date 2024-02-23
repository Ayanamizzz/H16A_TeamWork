// Description:
// Given basic details about a new quiz, create one for the logged in user.

function adminQuizCreate(authUserId, name, description) {
    return {
        quizId: 2,
    }
  }
  
// Description
// Given a particular quiz, permanently remove the quiz.

function adminQuizRemove(authUserId, quizId) {
    return {
    }
}
  

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.
function adminQuizList(authUserId) {
   return {
        quizzes: [
            {
                quizId: 1,
                name: 'My Quiz',
            }
        ]
   }
}
  

// Description
// Get all of the relevant information about the current quiz.


function adminQuizInfo (authUserId, quizId) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    }
}
