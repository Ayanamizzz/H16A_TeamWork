import { getData, setData } from './dataStore';

// Description
// Given a particular quiz, permanently remove the quiz.

/*
 * @params {number} token / Id of user after registration
 * @params {number} quizId / Id of quiz after creation
 * @returns {{}} Returns an empty objec
 * 
*/

export function adminQuizRemove(token: string, quizId: number): { error: string } | {}  {
    const data = getData();

    // Check userId by token:
    const userId = getUserId(token);
    if (userId == null) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    const user = data.users.find((user: user) => user.userId === userId);
    if (!user) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Quiz ID does not refer to a valid quiz:
    const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
    if (quiz === undefined) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    }

    // Quiz ID does not refer to a quiz that this user owns:
    if (quiz.ownerId !== userId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Remove the quiz that this user owns:
    for (let quiz of data.quizzes) {
        if (quizId === quiz.quizId) {
           if (UserId === quiz.ownerId) {
            quiz = null;
           }
        }
    }

    setData(data);
    return {};
}