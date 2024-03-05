import { getData, setData } from './dataStore';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

function adminQuizList(authUserId) {
   return {
        quizzes: [
            {
                quizId: 1,
                name: 'My Quiz',
            }
        ]
   }
}





// Description:
// Given basic details about a new quiz, create one for the logged in user.

//  * @param {authUserId} UserId - for example, 1.
//  * @param {name} name - for example, Jack Smith.
//  * @param {adescription} description - for example, 'This is my quiz'.
//  * @returns {quizId} Id of quiz.

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
    // Set tracker check vaild name.
    let valid_name = 0;

    // Check name only contains alphanumeric(characters and numbers) and spaces.
    for(const each of name) {
        if (('A' <= each <= 'Z'|| 'a' <= each <= 'z') && ('0' <= each <= '9') && each === '') {
            valid_name = 1;
        }
    }

    if (valid_name === 0) {
        // Name contains invalid characters. 
        return {
            error: 'Name contains invalid characters'
        }
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
    let length = dataStore.users.length;

    if (length === 0) {
        // empty users.
        Id = 0;
        
    } else {
        // users is not empty.
        // e.g. length = 2
        // index of users:     0 1 (2)
        // previous id is:     0 1 ()
        // thus the new id will be  2
        Id = (length * 1);
    }

    // Get the current time created.
    const currentTime = Date.now();

    const newQuiz = {
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

function adminQuizRemove(authUserId, quizId) {
    return {
    }
}
  




// Description:
// Get all of the relevant information about the current quiz.

function adminQuizInfo (authUserId, quizId) {
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    }
}






// Description:
// Update the name of the relevant quiz.

function adminQuizNameUpdate(authUserId, quizId, name) {
    return {}
}





// Description:
// Update the description of the relevant quiz.

function adminQuizDescriptionUpdate (authUserId, quizId, description) {
    return {}
}


export { adminQuizCreate };