import { getData, setData } from './dataStore';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/*
 * @params {autherUserId} UserId
 * @returns {quizzes[]} array of object for quizzes list
 * 
*/

/*
Error checking:
1. AuthUserId is not a valid user.
*/

function adminQuizList(authUserId) {
    // Get the dataStore.
    const data = getData();

    // Create an empty array to contains the list of quizzes that sare owned 
    // by the currently logged in user.
    const quizzes = [];

    for (const quiz of data.quizzes) {
        if (authUserId === quiz.ownerId) {
            const quizAdd = {
                quizId: quiz.quizId,
                name: quiz.name,
            };
            quizzes.push(quizAdd);
        }
    }

    // Just list all the quizzes, no need to setData.
    // // Update the data.
    // setData(data);

   return {
        quizzes: quizzes
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

function adminQuizRemove(authUserId, quizId) {
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


export { adminQuizList };