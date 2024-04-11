import { User, getData, setData, Answer, Quiz, Question } from './dataStore';
import { getUser } from './other';

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

// Description:
// Given basic details about a new quiz, create one for the logged in user.
function newQuestionsId(quiz: Quiz): number {
  let newId = 0;
  while (quiz.questions.some((question: Question) => question.questionId === newId)) {
    newId++;
  }
  return newId;
}

function updateColoursAndTimeEditied (quizId: number, questionId: number) {
  const data = getData();
  const quiz = data.quizzes.find((quiz: Quiz) => quizId === quiz.quizId);

  const colourKeys = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
  const indexOfQuestion = quiz.questions.findIndex((question: Question) => question.questionId === questionId);

  for (const answer of quiz.questions[indexOfQuestion].answers) {
    // Randomly selects a colour
    const randomIndex = Math.floor(Math.random() * colourKeys.length);
    answer.colour = colourKeys[randomIndex];
  }

  // Updates time last edited
  quiz.timeLastEdited = Date.now();

  setData(data);
}

/**
 *
 * @param {string} token - Id of user after registration
 * @param {string} name - New quiz's name
 * @param {string} description - New quiz's description
 * @returns {{ quizId: number }} - An object contains the new quizId after creating a quiz
 *
 */

export function adminQuizCreate(token: string, name: string, description: string): { quizId: number} | { error: string} {
  const data = getData();

  // Check userId by token.
  const newUser = getUser(token);
  if (newUser === null) {
    return { error: 'Token does not refer to valid logged in user session' };
  }

  const tokenId = newUser.userId;

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
    if (name === quiz.name && quiz.ownerId === newUser.userId) {
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
    questions: [],
    numQuestions: 0,
    duration: 0
  });

  setData(data);
  return {
    quizId: id
  };
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

export function adminQuizInfo(token: string, quizId: number): QuizInfoResponseV1 | ErrorResponse {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);
  if (!user) {
    // Token is empty.
    return { error: 'Token does not refer to valid logged in user session' };
  }

  const userId = user.userId;

  // Check quizId.
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  } else if (quiz.ownerId !== userId) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  // Return quiz info.
  return quiz;
  /*
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
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

  }; */
}

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/**
 * @params {number} token - Id of user after registration
 * @returns {quizzes} An array of object for quiz list
 *
*/

export function adminQuizList(token: string): {quizzes: {quizId: number, name: string}[]} | ErrorResponse {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);
  if (user === null) {
    return { error: 'Token does not refer to valid logged in user session' };
  }

  // // Check userId by token.
  // const user = getUser(token);
  // if (user === null) {
  //     // Token is empty.
  //     return { error: 'Token does not refer to valid logged in user session' };
  // }

  // Create an empty array to contains the list of quizzes that sare owned
  // by the currently logged in user.
  const quizzes = [];

  for (const quiz of data.quizzes) {
    if (quiz.ownerId === user.userId) {
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

export function adminQuizNameUpdate(token: string, quizId: number, name: string):object {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);
  if (user === null) {
    // Token is empty.
    return { error: 'Token does not refer to valid logged in user session' };
  }

  const userId = user.userId;

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

// Description
// Updates the description of a specific quiz.

/**
   * @param {string} token - Id of user after registration
   * @param {number} quizId - Id of quiz after creation
   * @param {string} description - The new description for the quiz.
   * @returns {{}} - An empty object
   *
   */

export function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): object {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);

  if (user === null) {
    // Token is empty.
    return { error: 'Token does not refer to valid logged in user session' };
  }

  const userId = user.userId;

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

// helper function
// Helper functions
/**
 * Checks if quiz name has already been used by the user
 *
 * @param authUserID User Id
 * @param name Name to check
 * @returns true or false
 */
function quizNameIsTaken (authUserID: number, name: string): boolean {
  const dataStore = getData();
  for (const quiz of dataStore.quizzes) {
    if (quiz.ownerId === authUserID && quiz.name === name) {
      return true;
    }
  }
  return false;
}

//*
// Description
// Transfer ownership of a quiz to another user.

/**
 *
 * @param {string} token - Id of user after registration
 * @param {number} quizId - Id of quiz after creation
 * @param {string} userEmail - Email of the user to transfer the quiz to
 * @returns {} - An empty object if successful, or an error object if not
 *
 */

export function adminQuizTransfer(token: string, quizId: number, userEmail: string) {
  const user = getUser(token);
  if (user === null) {
    // Token is empty.
    return { error: 'Token is empty or invalid' };
  }
  const data = getData();

  // Check quizId.
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    return { error: 'Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz' };
  }

  const newOwner = data.users.find((user: User) => userEmail === user.email);
  if (!newOwner) {
    return {
      error: 'userEmail is not a real user'
    };
  } else if (newOwner.userId === user.userId) {
    return {
      error: 'userEmail is the current logged in user'
    };
  }

  if (quizNameIsTaken(newOwner.userId, quiz.name)) {
    return {
      error: 'Quiz Id refers to a quiz that has a name that is already used by the target user'
    };
  }

  quiz.ownerId = newOwner.userId;

  setData(data);
  return {};
}

export function adminQuizRemove(token: string, quizId:number): unknown | {error: string} {
  const user = getUser(token);

  if (user === null) {
    return { error: 'Error Code 401 - Invalid token' };
  }
  const data = getData();
  const quizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (quizIndex === -1) {
    return { error: 'Error Code 403 -  either the quiz ID is invalid, or the user does not own the quiz' };
  }

  if (data.quizzes[quizIndex].ownerId !== user.userId) {
    return { error: 'Error Code 403 -  either the quiz ID is invalid, or the user does not own the quiz' };
  }
  const [removedQuiz] = data.quizzes.splice(quizIndex, 1);
  data.quizzesTrash.push(removedQuiz);
  setData(data);
  return { };
}

/**
   *
   * @param { number } quizId - the quizId of the current logged in admin user.
   * @param { number } token - the token of the current logged in admin user.
   * @returns { {} } An object from trash
   *
   */
export function adminQuizRestore(quizId: number, token: string): unknown| {error: string} {
  const user = getUser(token);

  if (user === null) {
    return { error: 'Code 401 - Token is empty or invalid' };
  }
  const data = getData();
  const trashQuizIndex = data.quizzesTrash.findIndex(q => q.quizId === quizId);
  if (trashQuizIndex === -1) {
    return { error: 'Code 400 - Quiz ID refers to a quiz that is not currently in the trash' };
  }

  const trashQuiz = data.quizzesTrash[trashQuizIndex];

  const sameName = data.quizzes.some(q => q.name === trashQuiz.name);
  if (sameName) {
    return { error: 'Code 400 - Quiz name of the restored quiz is already used by another active quiz' };
  }

  if (trashQuiz.ownerId !== user.userId) {
    return { error: 'Code 403 - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz' };
  }

  trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  data.quizzes.push(trashQuiz);
  //     // use splice remove test from trash and add it to the list.
  data.quizzesTrash.splice(trashQuizIndex, 1);
  setData(data);

  return {};
}

/** \
 * View the quizzes that are currently in the trash for the logged in user
 *
 * @param { string } token - the token of the current logged in admin user.
 * @returns { }
 */
export function adminQuizTrash(token: string): { quizzes: {name: string, quizId: number}[] } | {error: string} {
  const user = getUser(token);

  if (user === null) {
    return { error: 'Error Code 401 - Invalid token' };
  }
  const quizzes: {name: string, quizId: number}[] = [];
  const data = getData();
  for (const quiz of data.quizzesTrash) {
    if (quiz.ownerId === user.userId) {
      quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }
  return { quizzes };
}

export function adminQuizEmptyTrash(token: string, quizIds:string): unknown | {error: string} {
  const user = getUser(token);
  if (user === null) {
    return { error: 'Error Code 401 - Invalid token' };
  }
  const data = getData();
  const quizIdJson = JSON.parse(quizIds);

  for (const quizId of quizIdJson) {
    // use quizId find each quiz from trash.
    const quizInTrash = data.quizzesTrash.find((quiz) => quizId === quiz.quizId);
    if (!quizInTrash) {
      // current quiz is not in trash.
      const quizNotInTrash = data.quizzes.find((quiz) => quizId === quiz.quizId);
      if (quizNotInTrash) {
        return {
          error: '400 - One or more of the Quiz IDs is not currently in the trash'
        };
      }
    }

    if (quizInTrash.ownerId !== user.userId) {
      return {
        error: '403 - One or more of the Quiz IDs refers to a quiz that this current user does not own'
      };
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

export function adminQuestionCreate (token: string, quizId: number, questionBody: Question) {
  const data = getData();
  const user = getUser(token);
  if (user === null) {
    return { error: 'Token is empty or invalid' };
  }
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    return {
      error: 'either the quiz ID is invalid, or the user does not own the quiz'
    };
  }
  // Question string check
  if (
    questionBody.question.length > 50 || questionBody.question.length < 5) {
    return {
      error: 'Question string is less than 5 characters in length or is greater than 50 characters in length'
    };
  }

  // Question number of answer check
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers'
    };
  }
  // Duration is positive
  if (questionBody.duration <= 0) {
    return {
      error: 'The question duration is not a positive number'
    };
  }
  // The sum of the question durations in the quiz exceeds 3 minutes
  const totalDuration = quiz.questions.reduce((acc, question) => acc + question.duration, 0);
  if (totalDuration + questionBody.duration > 180) {
    return {
      error: 'The sum of the question durations in the quiz exceeds 3 minutes'
    };
  }

  // The points awarded for the question are less than 1 or greater than 10
  if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or greater than 10'
    };
  }
  // The length of any answer is shorter than 1 character long, or longer than 30 characters long
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return {
        error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long'
      };
    }
  }
  // Any answer strings are duplicates of one another (within the same question)
  const duplicates = (answer: Answer[]) => {
    const seen = new Set();
    for (const option of answer) {
      if (seen.has(option.answer)) {
        return true;
      }
      seen.add(option.answer);
    }
    return false;
  };
  if (duplicates(questionBody.answers)) {
    return {
      error: 'This answer strings are duplicates of one another'
    };
  }
  // There are no correct answers
  const checkAnswer = (answers: Answer[]) => {
    for (const answer of answers) {
      if (answer.correct === true) {
        return true;
      }
    }
    return false;
  };
  if (!checkAnswer(questionBody.answers)) {
    return {
      error: 'There are no correct answers'
    };
  }

  // Make a new update to data
  const questionId = newQuestionsId(quiz);
  const newQuestion: Question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: questionBody.answers,
  };

  quiz.questions.push(newQuestion);
  setData(data);

  // Update quiz timeLastEdited + colours
  updateColoursAndTimeEditied(quizId, questionId);
  return {
    questionId: questionId
  };
}

/**
 *
 * @param authUserId - authorized user id to perform the update
 * @param quizId - quiz that contains the question needing to be updated
 * @param questionId - question that needs to be updated
 * @param questionBody - new content for the question
 */

export function adminQuestionUpdate(token: string, quizId: number, questionId: number, questionBody: Question) {
  const data = getData();

  const user = getUser(token);

  if (user === null) {
    // Token is empty.
    return { error: 'Token is empty or invalid' };
  }
  const userId = user.userId;
  const quizToUpdate = data.quizzes.find((quiz: Quiz) => quiz.quizId === quizId);
  if (!quizToUpdate || userId !== quizToUpdate.ownerId) {
    return {
      error: 'either the quiz ID is invalid, or the user does not own the quiz'
    };
  }

  const questionToUpdate = quizToUpdate.questions.find((question: Question) => question.questionId === questionId);
  if (questionToUpdate === undefined) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz'
    };
  }

  // Validate questionBody fields
  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return {
      error: 'Question string is less than 5 characters in length or greater than 50 characters in length'
    };
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers'
    };
  }

  if (questionBody.duration <= 0) {
    return {
      error: 'The question duration is not a positive number'
    };
  }

  if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or greater than 10'
    };
  }

  if (questionBody.answers.some((answer: Answer) => answer.answer.length < 1 || answer.answer.length > 30)) {
    return {
      error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long'
    };
  }

  const answerStrings = questionBody.answers.map((answer: Answer) => answer.answer);
  if (new Set(answerStrings).size !== answerStrings.length) {
    return {
      error: 'Any answer strings are duplicates of one another (within the same question)'
    };
  }

  if (!questionBody.answers.some((answer: Answer) => answer.correct)) {
    return {
      error: 'There are no correct answers'
    };
  }

  // Calculate the total duration of all questions
  let totalDuration = questionBody.duration;
  for (const question of quizToUpdate.questions) {
    if (question.questionId !== questionId) { // Exclude the current question
      totalDuration += question.duration;
    }
  }
  // Include updated duration
  totalDuration += questionBody.duration;

  if (totalDuration > 180) {
    return {
      error: 'If the question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes'
    };
  }

  // Update question
  questionToUpdate.question = questionBody.question;
  questionToUpdate.duration = questionBody.duration;
  questionToUpdate.points = questionBody.points;
  questionToUpdate.answers = questionBody.answers;

  // Write data back to data
  setData(data);

  // Update quiz timeLastEdited + colours
  updateColoursAndTimeEditied(quizId, questionId);

  return {};
}

/**
 * Move the position of a question within a quiz.
 *
 * @param {number} quizId - The unique identifier of the quiz where the question belongs.
 * @param {number} questionId - The unique identifier of the question to be moved.
 * @param {string} token - The authentication token of the user for verifying user identity.
 * @param {number} newPosition - The new index position of the question within the quiz.
 *
 * @returns {object} - An empty object `{}` if the question is successfully moved; an object containing the error message `{ error: string }` if an error occurs.
 */

//  adminQuizQuestionMove
export function adminQuizQuestionMove(
  quizId: number,
  questionId: number,
  token: string,
  newPosition: number
): { error?: string } { // Note the adjusted return type indicating that 'error' is optional
  // Retrieve the data from the data store

  const data = getData();
  const user = getUser(token);
  if (user === null) {
    // Token is empty.
    return { error: 'Token is empty', code: 401 };
  }

  const userId = user.userId;
  // Attempt to locate the specified quiz
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Ensure the quiz exists
  if (!validQuiz) {
    return { error: 'QuizId does not refer to a valid quiz.', code: 403 };
  }

  // Verify that the user is the owner of the quiz
  if (validQuiz.ownerId !== userId) {
    return { error: 'The user does not own the quiz.', code: 403 };
  }

  // Find the index of the question to be moved within the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Ensure the question exists in the quiz
  if (questionIndex === -1) {
    return { error: 'QuestionId does not refer to a valid question within this quiz.', code: 400 };
  }

  // Validate the new position is within acceptable bounds
  if (newPosition < 0 || newPosition >= validQuiz.questions.length) {
    return { error: 'NewPosition is out of range.', code: 400 };
  }

  // Check if the new position is the same as the current position
  if (newPosition === questionIndex) {
    return { error: 'NewPosition is the same as the current position.', code: 400 };
  }

  // Perform the move operation: remove the question from its current position
  const [questionToUpdate] = validQuiz.questions.splice(questionIndex, 1);
  // And insert it at the new position
  validQuiz.questions.splice(newPosition, 0, questionToUpdate);

  // Update the last edited time of the quiz
  validQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  // Persist the updated data back into the data store
  setData(data);

  // Return an empty object to signify success
  return {};
}

/**
 * @param {string} token - The authentication token of the user.
 * @param {number} quizId - The ID of the quiz.
 * @param {number} questionId - The ID of the question to be duplicated.
 * @returns {Object} Either an error message or the ID of the new duplicated question.
 */

// quizQuestionDuplicate
export function adminQuizQuestionDuplicate(token: string, quizId: number, questionId: number): { error: string } | { newQuestionId: number } {
  // Get the data from the data store
  const data = getData();

  // Get the user id from the provided token
  const user = getUser(token);

  // Check UserId
  if (user == null) {
    // Token is empty.
    return { error: 'Code 401 Token does not refer to valid logged in user session' };
  }

  // Find the quiz object based on the provided quizId
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Check if the quiz exists
  if (!validQuiz) {
    return { error: 'Code 403 - QuizId not refer to a valid quiz.' };
  }

  // Check if the quiz is owned by the current user
  if (validQuiz.ownerId !== user.userId) {
    return { error: 'Code 403 - The user does not own the quiz.' };
  }

  // Find the index of the question in the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Check if the question exists in the quiz
  if (questionIndex === -1) {
    return { error: 'Code 400 - QuestionId does not refer to a valid question within this quiz.' };
  }

  // Create a new ID for the duplicated question
  const newQuestionId = newQuestionsId(validQuiz);
  // Duplicate the question
  const duplicatedQuestion = { ...validQuiz.questions[questionIndex], questionId: newQuestionId };
  // Insert the duplicated question into the quiz
  validQuiz.questions.splice(questionIndex + 1, 0, duplicatedQuestion);

  validQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  // Update the data
  setData(data);
  // Return the ID of the new question
  return { newQuestionId };
}

/**
 * Delete a specified question in a specified quiz
 *
 * @param {number} quizId The ID of the quiz
 * @param {number} questionId The ID of the question to be deleted
 * @param {boolean} throwHTTPError Whether to throw HTTP errors or return them in the response
 * @returns {ErrorResponse | Record<string, never>} An error or empty object on success
 */
export function adminQuestionDelete(token:string, quizId:number, questionId:number) {
  // Get data

  const data = getData();
  // Get the user id from the provided token
  const user = getUser(token);

  // Check UserId
  if (user == null) {
    // Token is empty.
    return { error: 'Code 401 Token does not refer to valid logged in user session' };
  }

  // Find the specified quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Check UserId
  if (!quiz || quiz.ownerId !== user.userId) {
    return { error: 'Code 403 Valid token is provided, but either the quiz ID is invalid, or the user does not own the quizn' };
  }

  // Find the index of the specified question in the quiz
  const questionIndex = quiz.questions.findIndex(q => q.questionId === questionId);
  // If the specified question is not found, return an error
  if (questionIndex === -1) {
    return { error: 'Code 400 Question Id does not refer to a valid question within this quiz' };
  }

  // Remove the question at the specified index
  quiz.questions.splice(questionIndex, 1);
  return {};
}
