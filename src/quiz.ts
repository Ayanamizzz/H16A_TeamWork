import { getData, setData } from "./dataStore";
import { User } from './dataStore.js';
import { getUser, getUserId } from './other'

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


// Description:
// Given basic details about a new quiz, create one for the logged in user.

/*
 * @params {number} token / Id of user after registration
 * @params {string} name / New quiz's name
 * @params {string} description / New quiz's description
 * @returns {{ quizId: number }} An object contains the new quizId after creating a quiz.
 * 
*/

export function adminQuizCreate(token: string, name: string, description: string): { error: string } | { quizId: number} {
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

    // Name contains invalid characters:
    const nameFormat = /^[a-zA-Z0-9\s]*$/;
    if (nameFormat.test(name) !== true) {
        return { error: 'Name contains invalid characters' };
    }
    
    // Name is either less than 3 characters long or more than 30 characters long:
    if (name.length < 3) {
        // Name is less than 3 characters long.
        return { error: 'Name is less than 3 characters long' };
    } else if (name.length > 30) {
        // Name is more than 30 characters long.
        return { error: 'Name is more than 30 characters long' };
    }

    // Name is already used by the current logged in user for another quiz:
    for (const quiz of data.quizzes) {
        if (name === quiz.name) {
            // Name is already used by the current logged in user for another quiz. 
            return { error: 'Name is already used by the current logged in user for another quiz' };    
        }
    }

    // Description is more than 100 characters in length (note: empty strings are OK):
    if (description.length > 100) {
        // Description is more than 100 characters in length.
        return { error: 'Description is more than 100 characters in length' };         
    }

    // create the new quiz with updated quizId:
    let Id = data.quizzes.length;
    
    const newQuiz = {
        ownerId: authUserId,
        quizId: Id,
        name: name,
        description: description,
        timeCreated: Date.now(),
    };
    data.quizzes.push(newQuiz);

    setData(data);
    return { quizId: Id };
}


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


/**
 * 
 * View the quizzes in trash.
 * 
 * @param { string } token - the token of the current logged in admin user.
 * @returns { }
 */

export function adminQuiztrash(token: string): { trash: {name: string, quizId: number}[] } | {error: string} {
    const user = getUser(token);

    if (!user) {
        return { error: 'Error Code 401 - Invalid token'};
    }

    const data = getData();
    const trash: {name: string, quizId: number}[] = [];
    for (const quiz of data.quizzes) {
        
        trash.push({
            quizId: quiz.quizId,
            name: quiz.name
        });
    }
    
    setData(data);
    return { trash };
}


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

    if (trashQuiz.authUserId !== user.userId) {
        return { error: 'Code 403 - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz'}
    }


    trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
    data.quizzes.push(trashQuiz);
    // use splice remove test from trash and add it to the list.
    data.quizzesTrash.splice(trashQuizIndex, 1);
    setData(data);
    return {};
}

