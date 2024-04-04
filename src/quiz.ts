import { getData, setData, User, Quiz } from "./dataStore";
import { getUser, getUserId } from './other'

export interface ErrorResponse {
    error: string
}

export interface QuizInfoResponseV1 {
    quizId: number;
    name: string;
    timeCreated: number;
    timeLastEdited: number;
    description: string;
    // numQuestions: number;
    // questions: [];
    // duration: number;
}



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


// Description
// Get all of the relevant information about the current quiz.

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

export function adminQuizInfo(token: string, quizId: number) {
  const data = getData();

  // Check userId by token:
  const userId = getUserId(token);

  const user = data.users.find(u => u.userId === userId);
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
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited || quiz.timeCreated,
    description: quiz.description,
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
  };
}

// Description
// Update the name of the specified quiz.
/**
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

export function adminQuizNameUpdate(token: string, quizId: number, name: string): { error: string} | {} {
  const data = getData();
  // Check userId by token:
  const userId = getUserId(token);
  const user = data.users.find(user => user.userId === authUserId);
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // Check if authUserId is a valid user
  if (!data.users.some(user => user. userId === userId)) {
      return { error: 'AuthUserId is not a valid user.' };
  }
  // Check if quizId refers to a valid quiz
  if (!quiz) {
      return { error: 'Quiz ID does not refer to a valid quiz.' };
  }
  // Check if the quiz belongs to the user
  if (quiz.ownerId !== userId) {
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


// Description
// Updates the description of a specific quiz.

/*
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

export function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): { error: string } | {} {
  const data = getData();
  const userId = getUserId(token);
  // Check if authUserId is a valid user
  const userExists = data.users.some(user => user.userId === userId);
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


// Description
// View the quizzes in trash.

/**
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
        
//         trash.push({
//             quizId: quiz.quizId,
//             name: quiz.name
//         });
//     }
    
//     setData(data);
//     return { trash };
// }


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
    
//     if (!user) {
//         return { error: 'Code 401 - Token is empty or invalid'}
//     }

//     const trashQuizIndex = data.quizzesTrash.findIndex(q => q.quizId === quizId);
//     if (trashQuizIndex === -1) {
//         return { error: 'Code 400 - Quiz ID refers to a quiz that is not currently in the trash'}
//     }

//     const trashQuiz = data.quizzesTrash[trashQuizIndex];

//     const sameName = data.quizzes.some(q => q.name === trashQuiz.name);
//     if (sameName) {
//         return { error: 'Code 400 - Quiz name of the restored quiz is already used by another active quiz'}
//     }

//     if (trashQuiz.authUserId !== user.userId) {
//         return { error: 'Code 403 - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz'}
//     }

    trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
    data.quizzes.push(trashQuiz);
    // use splice remove test from trash and add it to the list.
    data.quizzesTrash.splice(trashQuizIndex, 1);
    setData(data);
    return {};
}
