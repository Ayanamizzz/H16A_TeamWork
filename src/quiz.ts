import { getData, setData } from "./dataStore";
import { User } from './dataStore.js';
import {getUser, getUserId } from './other'

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

// function adminQuizList(authUserId) {
//    return {
//         quizzes: [
//             {
//                 quizId: 1,
//                 name: 'My Quiz',
//             }
//         ]
//    }
// }





// Description:
// Given basic details about a new quiz, create one for the logged in user.

// function adminQuizCreate(authUserId, name, description) {
//     return {
//         quizId: 2,
//     }
// }
  




// Description
// Given a particular quiz, permanently remove the quiz.

// function adminQuizRemove(authUserId, quizId) {
//     return {
//     }
// }
  




// Description:
// Get all of the relevant information about the current quiz.

// function adminQuizInfo (authUserId, quizId) {
//     return {
//         quizId: 1,
//         name: 'My Quiz',
//         timeCreated: 1683125870,
//         timeLastEdited: 1683125871,
//         description: 'This is my quiz',
//     }
// }






// Description:
// Update the name of the relevant quiz.

// function adminQuizNameUpdate(authUserId, quizId, name) {
//     return {}
// }





// Description:
// Update the description of the relevant quiz.

// function adminQuizDescriptionUpdate (authUserId, quizId, description) {
//     return {}
// }


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
    //用splice来从垃圾桶里移除测试， 并且添加到列表里
    data.quizzesTrash.splice(trashQuizIndex, 1);
    setData(data);
    return {};
}
