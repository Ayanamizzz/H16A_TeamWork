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

//  * @param {authUserId} UserId - for example, 1.
//  * @param {quizId} quizId - for example, 1.
//  * @returns {} .

/*
Error checking:
1. AuthUserId is not a valid user.
2. Quiz ID does not refer to a valid quiz.
3. Quiz ID does not refer to a quiz that this user owns.
*/

function adminQuizRemove(authUserId, quizId) {
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

    // Quiz ID does not refer to a valid quiz:
    // Set tracker check vaild quizId and get the ownerId of this quiz.
    let valid_quizId = 0;
    let check_ownerId = 0;

    for (const quiz of data.quizzes) {
        if (quizId === quiz.quizId) {
            valid_quizId = 1;
            check_ownerId = quiz.ownerId;
        }
    }

    if (valid_quizId === 0) {
        // Quiz ID does not refer to a valid quiz.
        return {
            error: 'Quiz ID does not refer to a valid quiz'
        }
    } 

    // Quiz ID does not refer to a quiz that this user owns:
    if (check_ownerId !== authUserId) {
        // Quiz ID does not refer to a quiz that this user owns.
        return {
            error: 'Quiz ID does not refer to a quiz that this user owns'
        }
    }

    const quizReplace = {};

    for (const quiz of data.quizzes) {
        if (quizId === quiz.quizId) {
           if (check_ownerId === authUserId) {
            quiz = quizReplace;
            data.quizzes.push(quiz);
           }
        
        }
    }

    return {};
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