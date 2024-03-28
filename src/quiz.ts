import { getData, setData } from './dataStore';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/*
 * @params {number} token / 
 * @returns {quizzes} array of object for quiz list
 * 
*/

export function adminQuizList(token: string): {quizzes: {quizId: number, name: string}[]} | { error: string } {
    const data = getData();
    
    // Check userId by token:
    const userId = getUserId(token);
    if (userId == null) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    const user = data.users.find((user: user) => user.userId === userId);
    if (user === undefined) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Create an empty array to contains the list of quizzes that sare owned 
    // by the currently logged in user.
    const quizzes = [];

    for (const quiz of data.quizzes) {
        if (userId === quiz.ownerId) {
            // found the quiz that user owns:
            // create a new object push the Id and name of this quiz to quizzes(array).
            const quizAdd = {
                quizId: quiz.quizId,
                name: quiz.name,
            };
            quizzes.push(quizAdd);
        }
    }

   return {
        quizzes: quizzes
   }
}
