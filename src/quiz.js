import { getData, setData } from './dataStore';

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





// Description:
// Given basic details about a new quiz, create one for the logged in user.

function adminQuizCreate(authUserId, name, description) {
    return {
        quizId: 2,
    }
}
  




// Description
// Given a particular quiz, permanently remove the quiz.

/*
Error checking:
1. AuthUserId is not a valid user.
2. Quiz ID does not refer to a valid quiz.
3. Quiz ID does not refer to a quiz that this user owns.
*/

function adminQuizRemove(authUserId, quizId) {
    // Get the dataStore.
    const data = getData();








    return {
    }
}
  




// Description:
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






// Description:
// Update the name of the relevant quiz.

function adminQuizNameUpdate(authUserId, quizId, name) {
    return {}
}





// Description:
// Update the description of the relevant quiz.

function adminQuizDescriptionUpdate (authUserId, quizId, description) {
    return {}
}

export { adminQuizRemove };