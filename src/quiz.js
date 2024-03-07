import { getData, setData } from './dataStore';

// Description
// Given a particular quiz, permanently remove the quiz.

/*
 * @params {autherUserId} UserId
 * @params {quizId} quizId
 * @returns {} 
 * 
*/

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
    // let quizReplace be null.
    let quizReplace = null;

    for (const quiz of data.quizzes) {
        if (quizId === quiz.quizId) {
            // copy the quiz to quizReplace.
            quizReplace = quiz;
            break; 
        }
    }

    if (quizReplace === null) {
        // quizId does not refer to a valid quiz.
        return {
            error: 'Quiz ID does not refer to a valid quiz'
        }      
    }


    // Quiz ID does not refer to a quiz that this user owns:
    if (quizReplace.ownerId !== authUserId) {
        // quizId refer to a valid quiz.
        // Quiz ID does not refer to a quiz that this user owns.
        return {
            error: 'Quiz ID does not refer to a quiz that this user owns'
        }
    }

    // Remove the quiz that this user owns:
    // Find the quiz with given quizId, and replace it to empty.
    for (let quiz of data.quizzes) {
        if (quizId === quiz.quizId) {
           if (authUserId === quiz.ownerId) {
            // remove this quiz.
            quiz = null;
           }
        
        }
    }

    // Update the data.
    setData(data);

    return {};
}

export { adminQuizRemove };