import { User, getData, setData, Answer, Quiz, Question, QuizState } from './dataStore';
import { getUser, getQuiz, CreateaSessionId, getQuizSession, getQuizState, updateSessionState } from './other';
import HTTPError from 'http-errors';

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
 * Moves a quiz specified by its ID to the trash, allowing for potential recovery.
 * This action also updates the quiz's `timeLastEdited` property to the current time.
 * Authentication is required, and the operation is only permitted if the requesting user owns the quiz.
 *
 * @param {string} token - User's authentication token.
 * @param {number} quizId - ID of the quiz to be trashed.
 * @returns {unknown | {error: string}} - An empty object on success, or an error object if the operation fails.
 */
export function adminQuizRemove(token: string, quizId:number): unknown | {error: string} {
  const user = getUser(token);

  if (user === null) {
    throw HTTPError(401, 'Invalid token');
  }
  const data = getData();
  const quizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (quizIndex === -1) {
    throw HTTPError(403, 'either the quiz ID is invalid, or the user does not own the quiz');
  }

  if (data.quizzes[quizIndex].ownerId !== user.userId) {
    throw HTTPError(403, 'either the quiz ID is invalid, or the user does not own the quiz');
  }
  const [removedQuiz] = data.quizzes.splice(quizIndex, 1);
  data.quizzesTrash.push(removedQuiz);
  setData(data);
  return { };
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
    duration: 0,
    sessions: [],
    thumbnailUrl: thumbnailUrl,
  });

  setData(data);
  return {
    quizId: id
  };
}

/**
 * Get all of the relevant information about a specific quiz.
 *
 * Errors:
 *   - Token does not refer to a valid logged in user session
 *   - Quiz ID does not refer to a valid quiz
 *   - Quiz ID does not refer to a quiz that this user owns
 *
 * @param {string} token - The token of the user requesting the quiz information.
 * @param {number} quizId - The ID of the quiz to retrieve information for.
 * @returns {QuizInfoResponseV1 | { error: string }} - An object containing quiz information if successful, or an error object if not.
 */

export function adminQuizInfo(token: string, quizId: number): QuizInfoResponseV1 | { error: string } {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);
  
  // Token is empty.
  if (!user) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const userId = user.userId;

  // Check quizId.
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz) {
    throw HTTPError(400, 'Quiz ID does not refer to a valid quiz');
  } 
  if (quiz.ownerId !== userId) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }


  return quiz;
  
}

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.
/**

 * @params {number} token - Id of user after registration
 * @returns {quizzes} An array of object for quiz list

 *
*/

export function adminQuizList(token: string): {quizzes: {quizId: number, name: string}[]} | { error: string } {
  const data = getData();

  // Check userId by token.
  const user = getUser(token);
  if (user === null) {
    return { error: 'Token does not refer to valid logged in user session' };
  }

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

/**
 * Update the name of a specific quiz.
 *
 * Errors:
 *   - Token does not refer to a valid logged in user session
 *   - Quiz ID does not refer to a valid quiz
 *   - Quiz ID does not refer to a quiz that this user owns
 *   - Name contains invalid characters
 *   - Name is less than 3 characters long
 *   - Name is more than 30 characters long
 *   - Name is already used by the current logged in user for another quiz
 *
 * @param {string} token - The token of the user updating the quiz name.
 * @param {number} quizId - The ID of the quiz to update the name for.
 * @param {string} name - The new name for the quiz.
 * @returns {Object} - An empty object if successful, or an error object if not.
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

/**
 * Update the description of a specific quiz.
 *
 * Errors:
 *   - Token does not refer to a valid logged in user session
 *   - Quiz ID does not refer to a valid quiz
 *   - Quiz ID does not refer to a quiz that this user owns
 *   - Description is more than 100 characters in length
 *
 * @param {string} token - The token of the user updating the quiz description.
 * @param {number} quizId - The ID of the quiz to update the description for.
 * @param {string} description - The new description for the quiz.
 * @returns {Object} - An empty object if successful, or an error object if not.
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


/**
 * View the quizzes that are currently in the trash for the logged in user
 *
 * @param { string } token - the token of the current logged in admin user.
 * @returns { }
 */
export function adminQuizTrash(token: string): { quizzes: {name: string, quizId: number}[] } | {error: string} {
  const user = getUser(token);

  if (user === null) {
    throw HTTPError(401, 'Invalid token');
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
  setData(data);

  return { quizzes };
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
    throw HTTPError(401, 'Invalid token');
  }
  const data = getData();
  const trashQuizIndex = data.quizzesTrash.findIndex(q => q.quizId === quizId);
  if (trashQuizIndex === -1) {
    throw HTTPError(400, 'Quiz ID refers to a quiz that is not currently in the trash');
  }

  const trashQuiz = data.quizzesTrash[trashQuizIndex];

  const sameName = data.quizzes.some(q => q.name === trashQuiz.name);
  if (sameName) {
    throw HTTPError(400, 'Quiz name of the restored quiz is already used by another active quiz');
  }

  if (trashQuiz.ownerId !== user.userId) {
    throw HTTPError(400, 'Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz');
  }

  trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  data.quizzes.push(trashQuiz);
  // use splice remove test from trash and add it to the list.
  data.quizzesTrash.splice(trashQuizIndex, 1);
  setData(data);

  return {};
}

export function adminQuizEmptyTrash(token: string, quizIds:string): unknown | {error: string} {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw HTTPError(401, 'Invalid token');
  }

  const quizIdJson = JSON.parse(quizIds);
  for (const quizId of quizIdJson) {
    // use quizId find each quiz from trash.
    const quizInTrash = data.quizzesTrash.find((quiz) => quizId === quiz.quizId);
    if (!quizInTrash) {
      // current quiz is not in trash.
      const quizNotInTrash = data.quizzes.find((quiz) => quizId === quiz.quizId);
      if (quizNotInTrash) {
        throw HTTPError(400, 'One or more of the Quiz IDs is not currently in the trash');
      }
    }

    if (quizInTrash.ownerId !== user.userId) {
      throw HTTPError(403, 'One or more of the Quiz IDs refers to a quiz that this current user does not own');
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


/**
 * Transfer ownership of a quiz to another user.
 *
 * Errors:
 *   - Token is empty or invalid
 *   - Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz
 *   - userEmail is not a real user
 *   - userEmail is the current logged in user
 *   - Quiz Id refers to a quiz that has a name that is already used by the target user
 *
 * @param {string} token - The token of the user transferring the quiz.
 * @param {number} quizId - The ID of the quiz to transfer.
 * @param {string} userEmail - The email of the user to transfer the quiz to.
 * @returns {Object} - An empty object if successful, or an error object if not.
 */

export function adminQuizTransfer(token: string, quizId: number, userEmail: string): object | { error: string } {
  const user = getUser(token);
  if (user === null) {
    // Token is empty.
    throw HTTPError(401, 'Invalid token');
  }
  const data = getData();

  // Check quizId.
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    throw HTTPError(403, 'Valid token is provided, but either the quiz ID is invalid, or the user does not own the quiz');
  }

  const newOwner = data.users.find((user: User) => userEmail === user.email);
  if (!newOwner) {
    throw HTTPError(400, 'userEmail is not a real user');
  } else if (newOwner.userId === user.userId) {
    throw HTTPError(400, 'userEmail is the current logged in user');
  }

  if (quizNameIsTaken(newOwner.userId, quiz.name)) {
    throw HTTPError(400, 'Quiz Id refers to a quiz that has a name that is already used by the target user');
  }

  quiz.ownerId = newOwner.userId;

  setData(data);
  return {};
}


/**
 * Create a new stub question for a particular quiz.
 *
 * When this route is called, and a question is created, the timeLastEdited is set as the same as the created time,
 * and the colours of all answers of that question are randomly generated.
 *
 * Errors:
 *   - Token is empty or invalid
 *   - Quiz ID is invalid or the user does not own the quiz
 *   - Question string is less than 5 characters in length or is greater than 50 characters in length
 *   - The question has more than 6 answers or less than 2 answers
 *   - The question duration is not a positive number
 *   - The sum of the question durations in the quiz exceeds 3 minutes
 *   - The points awarded for the question are less than 1 or greater than 10
 *   - The length of any answer is shorter than 1 character long, or longer than 30 characters long
 *   - Any answer strings are duplicates of one another (within the same question)
 *   - There are no correct answers
 *
 * @param {string} token - The token of the user creating the question.
 * @param {number} quizId - The ID of the quiz to create the question for.
 * @param {Question} questionBody - The details of the question to create.
 * @returns {Object} - An object containing the ID of the newly created question, or an error object if the question could not be created.
 */

export function adminQuestionCreate(
  token: string,
  quizId: number,
  question: string,
  duration: number,
  points: number,
  answers: Array<Answer>,
  thumbnailUrl: string
): { questionId: number } | { error: string } {
  const data = getData();
  const user = getUser(token);
  if (user === null) {
    throw HTTPError(401, 'Token is empty or invalid');
  }
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    throw HTTPError(403, 'Forbidden: The token is correct but does not belong to this user.');
  }
  // Question string check
  if (
    questionBody.question.length > 50 || questionBody.question.length < 5) {
    throw HTTPError(400, 'Bad Request: Question string is less than 5 characters in length or greater than 50 characters in length.');
  }

  // Question number of answer check
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw HTTPError(400, 'There has to be more than 2 answers or less than 6 answers given');
  }
  // Duration is positive
  if (questionBody.duration <= 0) {
    throw HTTPError(400, 'Duration must be positive!');
  }
  // The sum of the question durations in the quiz exceeds 3 minutes
  const totalDuration = quiz.questions.reduce((acc, question) => acc + question.duration, 0);
  if (totalDuration + questionBody.duration > 180) {
    throw HTTPError(400, 'The sum of the question durations in the quiz exceeds 3 minutes');
  }

  // The points awarded for the question are less than 1 or greater than 10
  if (questionBody.points < 1 || questionBody.points > 10) {
    throw HTTPError(400, 'The points awarded for the question are less than 1 or greater than 10');
  }

  // The length of any answer is shorter than 1 character long, or longer than 30 characters long
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      throw HTTPError(400, 'The length of any answer is shorter than 1 character long, or longer than 30 characters long');
      
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
    throw HTTPError(400, 'This answer strings are duplicates of one another');
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
    throw HTTPError(400, 'There are no correct answers');
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
 * Update a question within a quiz.
 *
 * When this route is called, the last edited time is updated, and the colours of all answers
 * of that question are randomly generated.
 *
 * Errors:
 *   - Token is empty or invalid
 *   - Quiz ID is invalid or the user does not own the quiz
 *   - Question ID does not refer to a valid question within this quiz
 *   - Question string is less than 5 characters in length or greater than 50 characters in length
 *   - The question has more than 6 answers or less than 2 answers
 *   - The question duration is not a positive number
 *   - The points awarded for the question are less than 1 or greater than 10
 *   - The length of any answer is shorter than 1 character long, or longer than 30 characters long
 *   - Any answer strings are duplicates of one another (within the same question)
 *   - There are no correct answers
 *   - If the question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes
 *
 * @param {string} token - The token of the user updating the question.
 * @param {number} quizId - The ID of the quiz containing the question to update.
 * @param {number} questionId - The ID of the question to update.
 * @param {Question} questionBody - The new details for the question.
 * @returns {Object} - An empty object if successful, or an error object if not.
 */

export function adminQuestionUpdate(token: string, quizId: number, questionId: number, questionBody: Question) {
  const data = getData();
  const user = getUser(token);

  if (user === null) {
    // Token is empty.
    throw HTTPError(401, 'Token is empty or invalid');
  }
  const userId = user.userId;
  const quizToUpdate = data.quizzes.find((quiz: Quiz) => quiz.quizId === quizId);
  if (!quizToUpdate || userId !== quizToUpdate.ownerId) {
    throw HTTPError(403, 'either the quiz ID is invalid, or the user does not own the quiz');
  }

  const questionToUpdate = quizToUpdate.questions.find((question: Question) => question.questionId === questionId);
  if (questionToUpdate === undefined) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  // Validate questionBody fields
  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw HTTPError(400, 'Question string is less than 5 characters in length or greater than 50 characters in length.');
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw HTTPError(400, 'There has to be more than 2 answers or less than 6 answers given');
  }

  if (questionBody.duration <= 0) {
    throw HTTPError(400, 'Duration must be positive!');
  }

  if (questionBody.points < 1 || questionBody.points > 10) {
    throw HTTPError(400, 'The points awarded for the question are less than 1 or greater than 10');
  }

  if (questionBody.answers.some((answer: Answer) => answer.answer.length < 1 || answer.answer.length > 30)) {
    throw HTTPError(400, 'Length of answer must be more than 1 character long or less than 30 characters long!');
  }

  const answerStrings = questionBody.answers.map((answer: Answer) => answer.answer);
  if (new Set(answerStrings).size !== answerStrings.length) {
    throw HTTPError(400, 'Any answer strings are duplicates of one another (within the same question)');
  }

  if (!questionBody.answers.some((answer: Answer) => answer.correct)) {
    throw HTTPError(400, 'There are no correct answers');
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
    throw HTTPError(400, 'If the question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes');
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
    throw HTTPError(401, 'Token is empty');
  }

  const userId = user.userId;
  // Attempt to locate the specified quiz
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Ensure the quiz exists
  if (!validQuiz) {
    throw HTTPError(403, 'QuizId does not refer to a valid quiz.');
  }

  // Verify that the user is the owner of the quiz
  if (validQuiz.ownerId !== userId) {
    throw HTTPError(403, 'The user does not own the quiz.');
  }

  // Find the index of the question to be moved within the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Ensure the question exists in the quiz
  if (questionIndex === -1) {
    throw HTTPError(400, 'QuestionId does not refer to a valid question within this quiz.');
  }

  // Validate the new position is within acceptable bounds
  if (newPosition < 0 || newPosition >= validQuiz.questions.length) {
    throw HTTPError(400, 'NewPosition is out of range.');
  }

  // Check if the new position is the same as the current position
  if (newPosition === questionIndex) {  
    throw HTTPError(400, 'NewPosition is the same as the current position.');
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
    throw HTTPError(401, 'Code 401 Token does not refer to valid logged in user session');
  }

  // Find the quiz object based on the provided quizId
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Check if the quiz exists
  if (!validQuiz) {
    throw HTTPError(403, 'QuizId not refer to a valid quiz.');
  }

  // Check if the quiz is owned by the current user
  if (validQuiz.ownerId !== user.userId) {
    throw HTTPError(403, 'The user does not own the quiz.');
  }

  // Find the index of the question in the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Check if the question exists in the quiz
  if (questionIndex === -1) {
    throw HTTPError(400, 'QuestionId does not refer to a valid question within this quiz.');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  // Find the specified quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Check UserId
  if (!quiz || quiz.ownerId !== user.userId) {
    throw HTTPError(403, 'Valid token is provided, but either the quiz ID is invalid, or the user does not own the quizn');
  }

  // Find the index of the specified question in the quiz
  const questionIndex = quiz.questions.findIndex(q => q.questionId === questionId);
  // If the specified question is not found, return an error
  if (questionIndex === -1) {
    throw HTTPError(400, 'Code 400 Question Id does not refer to a valid question within this quiz');
  }

  // Remove the question at the specified index
  quiz.questions.splice(questionIndex, 1);
  return {};
}


/**
 *
 * @param quizId - the quiz's ID
 * @param token - an authorized user token
 * @returns { sessionId: number } - The session id for the newly created session
 */
export function adminQuizSessionStart(
  token: string,
  quizId: number,
  autoStartNum: number
) {
  const data = getData();
  const user = getUser(token);

  if (!user) {
    throw HTTPError(401, 'Invalid token');
  }

  for (const trashQuiz of data.quizzesTrash) {
    if (trashQuiz.quizId === quizId) {
      throw HTTPError(400, 'Quiz is in the trash');
    }
  }

  const quiz = getQuiz(quizId);

  if (quiz.ownerId !== user.userId) {
    throw HTTPError(403, 'User doesn\'t own this quiz');
  }

  if (autoStartNum > 50) {
    throw HTTPError(400, 'autoStart num cannot be greater than 50');
  }

  // Check the number of active quizzes
  let count = 0;
  for (const session of quiz.sessions) {
    if (session.state !== QuizState.END) {
      count++;
    }
  }
  if (count > 10) {
    throw HTTPError(400, 'A quiz cannot have more than 10 active sessions');
  }

  if (quiz.questions.length === 0) {
    throw HTTPError(400, 'The quiz has no questions in it');
  }

  const sessionId = CreateaSessionId();

  // Get quiz copy data

  let quizCopy = null;

  // Thumbnail exists
  if (quiz.thumbnailUrl !== undefined) {
    quizCopy = {
      quizId: quiz.quizId,
      name: quiz.name,
      description: quiz.description,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      ownerId: quiz.ownerId,
      numQuestions: quiz.numQuestions,
      questions: quiz.questions,
      duration: quiz.duration,
      thumbnailUrl: quiz.thumbnailUrl
    };
  } else {
    // Thumbnail doesn't exist
    quizCopy = {
      quizId: quiz.quizId,
      name: quiz.name,
      description: quiz.description,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      ownerId: quiz.ownerId,
      numQuestions: quiz.numQuestions,
      questions: quiz.questions,
      duration: quiz.duration,
    };
  }

  quiz.sessions.push({
    sessionId: sessionId,
    autoStartNum: autoStartNum,
    state: QuizState.LOBBY,
    atQuestion: 0,
    timeElapsed: 0,
    timer: null,
    players: [],
    questionResults: [],
    chat: [],
    quiz: quizCopy,
  });

  const quizSession = getQuizSession(sessionId);
  // Now add each questionId of the quiz into questionResults

  for (const question of quizCopy.questions) {
    quizSession.questionResults.push({
      questionId: question.questionId,
      playersCorrectListAndScore: [],
      playersIncorrectList: [],
      totalAnswerTime: 0,
    });
  }

  return {
    sessionId: sessionId
  };
}


/**
 * Retrieves active and inactive session ids (sorted in ascending order) for a quiz.
 *
 * @param { string } token - The authorized user's token.
 * @param { number } quizId - The Id of the quiz.
 * @returns { object } - Object of Arrays containing the sessionIds of of active and inactive sessions for a quiz.
 *
 */
export function adminQuizSessionView(
  token: string,
  quizId: number
): object | { error: string } {
  const thisUser = getUser(token);

  // Checks valid Token
  if (!thisUser) {
    throw HTTPError(401, 'Invalid token');
  }

  // Checks valid Quiz
  const quiz = getQuiz(quizId);
  if (!quiz) {
    throw HTTPError(403, 'Invalid QuizId');
  }

  // Check if the user owns this quiz
  if (quiz.ownerId !== thisUser.userId) {
    throw HTTPError(403, 'Forbidden: The token is correct but does not belong to this user.');
  }

  const sessions = {
    activeSessions: [] as number[],
    inactiveSessions: [] as number[],
  };

  for (const session of quiz.sessions) {
    if (session.state === QuizState.END) {
      sessions.inactiveSessions.push(session.sessionId);
    } else {
      sessions.activeSessions.push(session.sessionId);
    }
  }

  // Sorts in ascending order
  sessions.activeSessions.sort((a, b) => a - b);
  sessions.inactiveSessions.sort((a, b) => a - b);

  return sessions;
}


/** adminUpdateQuizSession
 * Get the final results for all players for a completed quiz session in a csv format and generate a link.
 *
 * @param {string} token - an authorized user token.
 * @param {number} quizId - The id for the quiz.
 * @param {number} sessionId - the id for the session.
 * @param {Quizstate} action - the state of the quiz.
 * @returns {object} quizId - the quiz's ID; a number
 *
 *
 */
export function adminUpdateQuizSession(
  token: string,
  quizId: number,
  sessionId: number,
  action: string
) {
  const thisUser = getUser(token);

  if (!thisUser) {
    throw HTTPError(401, 'Status 401 - Invalid token');
  }

  // Get the quiz
  const quiz = getQuiz(quizId);

  // if quiz Id is invalid return error
  if (!quiz) throw HTTPError(400, 'Quiz does not exist.');
  // 403 Valid token is provided, but user is not an owner of this quiz
  if (quiz.ownerId !== thisUser.userId) throw HTTPError(403, 'Forbidden: The token is correct but does not belong to user');
  // get the session from the quiz - may need a helper function
  const session = getQuizSession(sessionId);
  // 400 Session Id does not refer to a valid session within this quiz
  if (!session) throw HTTPError(400, 'Status 400 - Session does not exist.');

  // Action provided is not a valid Action enum
  const quizState = getQuizState(action);
  if (quizState === null) throw HTTPError(400, 'Status 400 - Action provided is not a valid Action enum');

  // Action enum cannot be applied in the current state (see spec for details)
  if (updateSessionState(quizState, session) === null) throw HTTPError(400, 'Status 400 - Action enum cannot be applied in the current state.');

  return {};
}
