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
