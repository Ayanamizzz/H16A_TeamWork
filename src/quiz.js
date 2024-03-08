import { getData, setData } from './dataStore';
  
/**
 * Get all of the relevant information about the current quiz.
 * @param {number} authUserId - The authentication ID of the user
 * @param {number} quizId - The ID of the quiz to get information for
 * @returns {Object} - An object containing quiz information or an error message
 * it will return error when
 * - authUserId is not a valid user
 * - quizId does not refer to a valid quiz
 * - quizId does not refer to a quiz this user owns
 */

function adminQuizInfo(authUserId, quizId) {
    const data = getData();
    // Check if authUserId is a valid user
    const user = data.users.find(u => u.authUserId === authUserId);
    if (!user) {
        return { error: 'AuthUserId is not a valid user' };
    }
    
    // First, check if the Quiz ID refers to a valid quiz
    const validQuiz = data.quizzes.find(q => q.quizId === quizId);
    if (validQuiz === undefined) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    }

    // Then, check if the quiz belongs to the user
    if (validQuiz.ownerId !== authUserId) {
        return { error: 'Quiz ID does not refer to a quiz this user owns' };
    }

    // All checks passed, return relevant quiz info
    return {
        quizId: validQuiz.quizId,
        quizName: validQuiz.name,
        timeCreated: validQuiz.timeCreated,
        timeLastEdited: validQuiz.timeLastEdited || validQuiz.timeCreated,
        description: validQuiz.description
    };
}

export { adminQuizInfo };


/**
 * Update the name of the specified quiz.
 * 
 * @param {number} authUserId - The ID of the user attempting the update.
 * @param {number} quizId - The ID of the quiz to be updated.
 * @param {string} newName - The new name for the quiz.
 * @returns {Object} - An object indicating success or containing an error message.
 * 
 * Error checking:
 * - AuthUserId is not a valid user.
 * - QuizId does not refer to a valid quiz.
 * - QuizId does not refer to a quiz this user owns.
 * - NewName contains invalid characters. Valid characters are alphanumeric and spaces.
 * - NewName is either less than 3 characters long or more than 30 characters long.
 * - NewName is already used by the current logged in user for another quiz.
 */


function adminQuizNameUpdate(authUserId, quizId, name) {
    const data = getData();
    const user = data.users.find(user => user.userId === authUserId);
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
    // Check if authUserId is a valid user
    if (!data.users.some(user => user.authUserId === authUserId)) {
        return { error: 'AuthUserId is not a valid user.' };
    }
    // Check if quizId refers to a valid quiz
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz.' };
    }
    // Check if the quiz belongs to the user
    if (quiz.ownerId !== authUserId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns.' };
    } else if  (/[^a-zA-Z0-9\s]/.test(name)) {
        return { error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces.' };
    } else if (name.length < 3) {
        return { error: 'Name is less than 3 characters long.' };  
    }
    else if (name.length > 30) {
        return { error: 'Name is longer than 30 characters long.' };
    }
    else if (data.quizzes.some(quiz => quiz.name === name)) {
        return { error: 'Name is already used by the current logged in user for another quiz.' };
    }
    quiz.name = name;
    setData(data);
    return {}
}

export { adminQuizNameUpdate };



/**
 * Updates the description of a specific quiz.
 * 
 * @param {number} authUserId The ID of the user attempting to update the quiz description.
 * @param {number} quizId The ID of the quiz whose description is being updated.
 * @param {string} newDescription The new description for the quiz.
 * @returns {Object}  empty object indicating the success of the operation or containing an error message.
 * return error message if
 * - authUserId is not a valid user
 * - quizId does not refer to a valid quiz
 * - quizId does not refer to a quiz that this user owns
 * - newDescription is more than 100 characters in length (note: empty strings are OK)
 * return empty object if
 * - the description of the quiz is successfully updated
 */

function adminQuizDescriptionUpdate (authUserId, quizId, description) {
    const data = getData();
    // Check if authUserId is a valid user
    const userExists = data.users.some(user => user.authUserId === authUserId);
    if (!userExists) {
        return { error: 'AuthUserId is not a valid user.' };
    }
    // Find the quiz and check if it exists
    const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz.' };
    }
    // Check if the quiz belongs to the user
    if (quiz.ownerId !== authUserId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns.' };
    }    
    // Check if the new description is valid
    if (description.length > 100) {
        return { error: 'Description is more than 100 characters in length (note: empty strings are OK).' };
    }else {
        quiz.description = description;
        setData(data);
        return { };
    }
}

export { adminQuizDescriptionUpdate };
