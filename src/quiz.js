import { getData, setData } from './dataStore';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/*
 * @params {autherUserId} UserId
 * @returns {quizzes} array of object for quiz list
 * 
*/

/*
Error checking:
1. AuthUserId is not a valid user.
*/

function adminQuizList(authUserId) {
    // Get the dataStore.
    const data = getData();
        
    // AuthUserId is not a valid user:
    // Set tracker check vaild authUserId.
    let valid_authUserId = 0;

    for (const user of data.users) {
        if (authUserId === user.authUserId) {
            valid_authUserId = 1;
        }
    } 

    if (valid_authUserId === 0) {
        // AuthUserId is not a valid user.
        return {
            error: 'AuthUserId is not a valid user'
        }
    }

    // Create an empty array to contains the list of quizzes that sare owned 
    // by the currently logged in user.
    const quizzes = [];

    for (const quiz of data.quizzes) {
        if (authUserId === quiz.ownerId) {
            // found the quiz that user owns:
            // create a new object push the Id and name of this quiz to quizzes(array).
            const quizAdd = {
                quizId: quiz.quizId,
                name: quiz.name,
            };
            quizzes.push(quizAdd);
        }
    }

    // Just list all the quizzes, no need to setData.

   return {
        quizzes: quizzes
   }
}

export { adminQuizList };