import { getData, setData } from './dataStore';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/*
 * @params {autherUserId} UserId
 * @returns {quizzes} array of object for quiz list
 * 
*/

/*
Error checking:
1. AuthUserId is not a valid user.
*/

function adminQuizList(authUserId) {
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

    // Create an empty array to contains the list of quizzes that sare owned 
    // by the currently logged in user.
    const quizzes = [];

    for (const quiz of data.quizzes) {
        if (authUserId === quiz.ownerId) {
            // found the quiz that user owns:
            // create a new object push the Id and name of this quiz to quizzes(array).
            const quizAdd = {
                quizId: quiz.quizId,
                name: quiz.name,
            };
            quizzes.push(quizAdd);
        }
    }

    // Just list all the quizzes, no need to setData.

   return {
        quizzes: quizzes
   }
}





// Description:
// Given basic details about a new quiz, create one for the logged in user.

/*
 * @params {autherUserId} UserId
 * @params {name} name of quiz
 * @params {description} description of quiz
 * @returns {quizId} Id of quiz
 * 
*/

/*
Error checking:
1. AuthUserId is not a valid user.
2. Name contains invalid characters. Valid characters are alphanumeric and spaces.
3. Name is either less than 3 characters long or more than 30 characters long.
4. Name is already used by the current logged in user for another quiz.
5. Description is more than 100 characters in length (note: empty strings are OK).
*/

function adminQuizCreate(authUserId, name, description) {
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

    // Name contains invalid characters:
    // Set format that name could only contains number, character and space.
    const nameFormat = /^[a-zA-Z0-9\s]*$/;

    if (nameFormat.test(name) !== true) {
        return {
          error: 'Name contains invalid characters'
        };
    }
    

    // Name is either less than 3 characters long or more than 30 characters long:
    if (name.length < 3) {
        // Name is less than 3 characters long.
        return {
            error: 'Name is less than 3 characters long'
        }
    }

    if (name.length > 30) {
        // Name is more than 30 characters long.
        return {
            error: 'Name is more than 30 characters long'
        }
    }

    // Name is already used by the current logged in user for another quiz:
    for (const quiz of data.quizzes) {
        if (name === quiz.name) {
            // Name is already used by the current logged in user for another quiz. 
            return {
                error: 'Name is already used by the current logged in user for another quiz'
            }    
        }

    }

    // Description is more than 100 characters in length (note: empty strings are OK):
    if (description.length > 100) {
        // Description is more than 100 characters in length.
        return {
            error: 'Description is more than 100 characters in length'
        }         
    }

    // After error checking, create the new quiz with updated quizId:
    // Set the quizId start from 1.
    let Id = 0;

    // Set unique Id.
    let length = data.quizzes.length;

    if (length === 0) {
        // empty quizzes.
        Id = 0;
        
    } else {
        // quiz is not empty.
        // e.g. length = 2
        // index of quiz:     0 1 (2)
        // previous id is:    0 1 ()
        // thus the new id will be  2
        Id = length;
    }

    // Get the current time created.
    const currentTime = Date.now();

    const newQuiz = {
        ownerId: authUserId,
        quizId: Id,
        name: name,
        description: description,
        timeCreated: currentTime,
    };

    // Store the info of new quiz.
    data.quizzes.push(newQuiz);

    // Update the data.
    setData(data);

    return {
        quizId: Id
    };
}





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

export { adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizInfo, adminQuizNameUpdate, adminQuizDescriptionUpdate };
