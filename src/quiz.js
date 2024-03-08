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

export { adminQuizList, adminQuizCreate, adminQuizRemove }