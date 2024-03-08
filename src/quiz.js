
  
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






