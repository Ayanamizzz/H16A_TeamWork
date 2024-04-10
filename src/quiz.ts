import { getData, setData } from "./dataStore";
import { User, ErrorResponse} from './dataStore.js';
import { getUser, getUserId } from './other'

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/**
 * @param {string} token - Id of user after registration
 * @returns {quizzes} An array of object for quiz list
 * 
*/

export function adminQuizList(token: string): {quizzes: {quizId: number, name: string}[]} | ErrorResponse {
    const data = getData();
    
    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const tokenId = getUserId(token);
    if (tokenId === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    // Create an empty array to contains the list of quizzes that sare owned 
    // by the currently logged in user.
    const quizzes = [];

    for (const quiz of data.quizzes) {
        if (quiz.ownerId === tokenId) {
            // found the quiz that user owns:
            // push the Id and name of this quiz to quizzes(array).
            quizzes.push({
                quizId: quiz.quizId,
                name: quiz.name
            });
        }
    }

   return {
        quizzes: quizzes
   };
}


// Description:
// Given basic details about a new quiz, create one for the logged in user.

/**
 * 
 * @param {string} token - Id of user after registration
 * @param {string} name - New quiz's name
 * @param {string} description - New quiz's description
 * @returns {{ quizId: number }} - An object contains the new quizId after creating a quiz
 *
 */

export function adminQuizCreate(token: string, name: string, description: string): { quizId: number} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const tokenId = getUserId(token);
    if (tokenId === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    // Check name and description.
    const nameFormat = /^[a-zA-Z0-9\s]*$/;
    if (nameFormat.test(name) !== true) {
        return { error: 'Name contains invalid characters' };
    } else if (name.length < 3) {
        return { error: 'Name is less than 3 characters long' };
    } else if (name.length > 30) {
        return { error: 'Name is more than 30 characters long' };
    } else if (description.length > 100) {
        return { error: 'Description is more than 100 characters in length' };         
    }

    for (const quiz of data.quizzes) {
        if (name === quiz.name) {
            return { error: 'Name is already used by the current logged in user for another quiz' };    
        }
    }

    // Generate new quizId.
    const id = data.quizzes.length;
    
    data.quizzes.push({
        quizId: id,
        name: name,
        description: description,
        timeCreated: Date.now(),
        timeLastEdited: Date.now(),
        ownerId: tokenId,
    });

    setData(data);
    return { 
        quizId: id 
    };
}


// Description
// Given a particular quiz, permanently remove the quiz.

/**
 * 
 * @param {string} token - Id of user after registration
 * @param {number} quizId - Id of quiz after creation
 * @returns {{}} - An empty object
 *
 */

export function adminQuizRemove(token: string, quizId: number): {} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const tokenId = getUserId(token);
    if (tokenId === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    // Check quizId.
    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (quiz === null) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    } else if (quiz.ownerId !== tokenId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Remove quiz that user owns.
    for (const quiz of data.quizzes) {
        if (quiz.quizId === quizId && quiz.ownerId === tokenId) {
            quiz = null;
        }
    }
    // if (quiz.ownerId.Include(tokenId)) {
    //     quiz = null;
    // }

    setData(data);
    return {};
}


// Description
// Get all of the relevant information about the current quiz.

/**
 * 
 * @param {string} token - Id of user after registration
 * @param {number} quizId - Id of quiz after creation
 * @returns {QuizInfoResponseV1} - An object containing quiz information
 *
 */

export function adminQuizInfo(token: string, quizId: number): QuizInfoResponseV1 | ErrorResponse{
    const data = getData();

    // Check userId by token.
    const user = getUser(token);
    if (!user) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const userId = getUserId(token);
    if (!userId) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Check quizId.
    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    } else if (quiz.ownerId !== userId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Return quiz info.
    return {
        quizId: quiz.quizId,
        name: quiz.name,
        timeCreated: quiz.timeCreated,
        timeLastEdited: quiz.timeLastEdited,
        description: quiz.description,
        /*
        numQuestions: quiz.questions.length,
        questions: quiz.questions.map(question => ({
        questionId: question.questionId,
        question: question.question,
        duration: question.duration,
        points: question.points,
        answers: question.answers.map(answer => ({
            answerId: answer.answerId,
            answer: answer.answer,
            colour: answer.colour,
            correct: answer.correct,
        })),
        })),
        duration: quiz.duration,
        */
    };
}


// Description
// Update the name of the specified quiz.

/**
 * 
 * @param {string} token - Id of user after registration
 * @param {number} quizId - Id of quiz after creation
 * @param {string} name - The new name need to update
 * @returns {{}} - An empty object
 * 
 */

export function adminQuizNameUpdate(token: string, quizId: number, name: string): {} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const user = getUser(token);
    if (!user) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const userId = getUserId(token);
    if (!userId) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Check quizId.
    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    } else if (quiz.ownerId !== userId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Check name.
    const nameFormat = /^[a-zA-Z0-9\s]*$/;
    if (nameFormat.test(name) !== true) {
        return { error: 'Name contains invalid characters' };
    } else if (name.length < 3) {
        return { error: 'Name is less than 3 characters long' };
    } else if (name.length > 30) {
        return { error: 'Name is more than 30 characters long' };
    }

    for (const quiz of data.quizzes) {
        if (name === quiz.name) {
            return { error: 'Name is already used by the current logged in user for another quiz' };    
        }
    }

    // Update name of quiz.
    quiz.name = name;
    setData(data);
    return {};
}


// export function adminQuizNameUpdate(token: string, quizId: number, name: string): {} | ErrorResponse {
//     const data = getData();

//     // Check userId by token.
//     const newUser = getUser(token);
//     if (newUser === null) {
//         return { error: 'Token does not refer to valid logged in user session' };
//     } 

//     const tokenId = getUserId(token);
//     if (tokenId === null) {
//         return { error: 'Token does not refer to valid logged in user session' };
//     } 

//     // Check quizId.
//     const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
//     if (!quiz) {
//         return { error: 'Quiz ID does not refer to a valid quiz' };
//     } else if (quiz.ownerId !== userId) {
//         return { error: 'Quiz ID does not refer to a quiz that this user owns' };
//     }

//     // Check name.
//     const nameFormat = /^[a-zA-Z0-9\s]*$/;
//     if (nameFormat.test(name) !== true) {
//         return { error: 'Name contains invalid characters' };
//     } else if (name.length < 3) {
//         return { error: 'Name is less than 3 characters long' };
//     } else if (name.length > 30) {
//         return { error: 'Name is more than 30 characters long' };
//     }

//     for (const quiz of data.quizzes) {
//         if (name === quiz.name) {
//             return { error: 'Name is already used by the current logged in user for another quiz' };    
//         }
//     }

//     // Update name of quiz.
//     quiz.name = name;
//     setData(data);
//     return {};
// }


// Description
// Updates the description of a specific quiz.

/**
 * @param {string} token - Id of user after registration
 * @param {number} quizId - Id of quiz after creation
 * @param {string} description - The new description for the quiz.
 * @returns {{}} - An empty object
 *
 */

export function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): {} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const user = getUser(token);
    if (!user) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const userId = getUserId(token);
    if (!userId) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Check quizId.
    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    } else if (quiz.ownerId !== userId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Check description.
    if (description.length > 100) {
        return { error: 'Description is more than 100 characters in length' };
    } 

    // Update description of quiz.
    quiz.description = description;
    setData(data);
    return {};
}



// Description
// View the quizzes in trash.

/**\
 * 
 * @param { string } token - the token of the current logged in admin user.
 * @returns { }
 */

export function adminQuiztrash(token: string): object | {error: string} {
    const user = getUser(token);
    const data = getData();
    if (!user) {
        return { error: 'Error Code 401 - Invalid token'};
    }
    const trash = [];
    for (const quiz of data.quizzesTrash) {
        if (quiz.ownerId === user.userId) {
            trash.push({
                quizId: quiz.quizId,
                name: quiz.name
            });
        }
    }
    
    setData(data);
    return { quizzes:trash };
}


// Description
// Restore a particular quiz from the trash back to an active quiz.

/**
 * 
 * @param { number } quizId - the quizId of the current logged in admin user.
 * @param { number } token - the token of the current logged in admin user.
 * @returns { {} } An object from trash
 * 
 */ 

export function adminQuizRestore(quizId: number, token: string): object | {error: string} {
    const data = getData();
    const user = getUser(token);
    
    if (!user) {
        return { error: 'Code 401 - Token is empty or invalid'}
    }

    const trashQuizIndex = data.quizzesTrash.findIndex(q => q.quizId === quizId);
    if (trashQuizIndex === -1) {
        return { error: 'Code 400 - Quiz ID refers to a quiz that is not currently in the trash'}
    }

    const trashQuiz = data.quizzesTrash[trashQuizIndex];

    const sameName = data.quizzes.some(q => q.name === trashQuiz.name);
    if (sameName) {
        return { error: 'Code 400 - Quiz name of the restored quiz is already used by another active quiz'}
    }

    if (trashQuiz.ownerId !== user.userId) {
        return { error: 'Code 403 - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz'}
    }

    trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
    data.quizzes.push(trashQuiz);
    // use splice remove test from trash and add it to the list.
    data.quizzesTrash.splice(trashQuizIndex, 1);

    
    setData(data);
    return {};
}




// Description
// Permanently delete specific quizzes currently sitting in the trash.

/**
 * 
 * @param { string } token - The token of the current logged in admin user
 * @param { string } quizIds - A string representing a JSONified array of quiz id numbers
 * @returns { {} } An object from trash
 * 
 */ 

export function adminQuizEmptyTrash(token: string, quizIds: string[]): {} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: '401 - Token does not refer to valid logged in user session' };
    } 

    for (const quizId of quizIds) {
        // use quizId find each quiz from trash.
        const quizInTrash = data.quizzesTrash.find((quiz) => quizId === quiz.quizId);
        if (quizInTrash === null) {
            // current quiz is not in trash.
            const quizNotInTrash = data.quizzes.find((quiz) => quizId === quiz.quizId);
            if (quizNotInTrash !== null) {
                return { 
                    error: '400 - One or more of the Quiz IDs is not currently in the trash'
                }
            }
        }

        // quiz in the trash, check user owns.
        if (quiz.ownerId !== newUser.userId) {
            return {
                error: '403 - One or more of the Quiz IDs refers to a quiz that this current user does not own'
            }
        }

        // delete quiz from trash.
        const quizIndex = data.quizzesTrash.findIndex((quiz) => quizId === quiz.quizId);
        if (quizIndex !== -1) {
          data.quizzesTrash.splice(quizIndex, 1);
        }
    }

    setData(data);
    return {};
}


// Description
// Delete a particular question from a quiz.

/**
 * 
 * @param { number } quizId - Id of a quiz
 * @param { number } questionid - Id of a question
 * @param { string } token - Token of the current logged in admin user
 * @returns { {} } An object from trash
 * 
 */ 

export function adminQuizQuestionDelete(quizId: number, questionId: number, token: string): {} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: '401 - Token does not refer to valid logged in user session' };
    } 

    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (quiz === null) {
        // valid token is provided.
        return { error: '403 - The quiz ID is invalid' };
    } else if (quiz.ownerId !== newUser.userId) {        
        // valid token is provided.
        return { error: '403 - The user does not own the quiz' };
    }

    // Find the question to remove
    const questionIndex = quiz.session.questions.findIndex((question) => question.questionId === questionId);
    if (questionIndex === -1) {
        return { error: '400 - Question Id does not refer to a valid question within this quiz'};
    }

    // Any session for this quiz is not in END state.
    // 

    quiz.session.questions.splice(questionIndex, 1);
    setData(data);
    return {};
}