import { User, getData, setData, Answer, Quiz, Question, QuizState } from './dataStore';
import { getUser, getQuiz, CreateaSessionId, getQuizSession, getQuizState, updateSessionState } from './other';
import HTTPError from 'http-errors';
import { User, getData, setData, Answer, Quiz, Question } from './dataStore';
import { getUser } from './other';
import createError from 'http-errors';

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
 * Lists all user's quizzes.
 *
 * @param {string} token - the token of the current logged in admin user
 * @returns {quizzes: {quizId: number, name: string}[] }
 *
 */

export function adminQuizList(token: string): {quizzes: { quizId: number, name: string}[] } | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  // Create an empty array to contains the list of quizzes that sare owned
  // by the currently logged in user.
  const quizzes = [];

  for (const quiz of data.quizzes) {
    if (quiz.ownerId === user.userId) {
      // found the quiz that user owns.
      quizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }

  return { quizzes: quizzes };
}

/**
 * Create a new quiz.
 *
 * @param {string} token - the token of the current logged in admin user
 * @param {string} name - the name of new quiz
 * @param {string} description - the description of new quiz
 * @returns {{ quizId: number }} - an object contains the new quizId after creating a quiz
 *
 */

export function adminQuizCreate(token: string, name: string, description: string): { quizId: number } | { error: string } {
  const data = getData();

  const newUser = getUser(token);
  if (newUser === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const tokenId = newUser.userId;
  const nameFormat = /^[a-zA-Z0-9\s]*$/;
  if (nameFormat.test(name) !== true) {
    throw createError(400, 'Name contains invalid characters.');
  } else if (name.length < 3 || name.length > 30) {
    throw createError(400, 'Name is either less than 3 characters long or more than 30 characters long.');
  } else if (description.length > 100) {
    throw createError(400, 'Description is more than 100 characters in length.');
  }

  for (const quiz of data.quizzes) {
    if (name === quiz.name && quiz.ownerId === newUser.userId) {
      throw createError(400, 'Name is already used by the current logged in user for another quiz.');
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
 * Send a quiz to trash.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} token - the token of the current logged in admin user
 * @returns {unknown}
 *
 */

export function adminQuizRemove(token: string, quizId:number): unknown | { error: string } {
  const user = getUser(token);

  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }
  const data = getData();
  const quizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (quizIndex === -1) {
    throw createError(403, 'either the quiz ID is invalid, or the user does not own the quiz');
  }

  if (data.quizzes[quizIndex].ownerId !== user.userId) {
    throw createError(403, 'either the quiz ID is invalid, or the user does not own the quiz');
  }

  const [removedQuiz] = data.quizzes.splice(quizIndex, 1);
  data.quizzesTrash.push(removedQuiz);
  setData(data);
  return { };
}

/**
 * Get info about current quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} token - the token of the current logged in admin user
 * @returns {QuizInfoResponseV1}
 *
 */

export function adminQuizInfo(token: string, quizId: number): QuizInfoResponseV1 | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (!user) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const userId = user.userId;
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz.ownerId !== userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  return quiz;
}

/**
 * Get info about current quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} token - the token of the current logged in admin user
 * @param {string} name - the new name for the quiz.
 * @returns {unknown}
 *
 */

export function adminQuizNameUpdate(token: string, quizId: number, name: string): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const userId = user.userId;
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz.ownerId !== userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  const nameFormat = /^[a-zA-Z0-9\s]*$/;
  if (nameFormat.test(name) !== true) {
    throw createError(400, 'Name contains invalid characters.');
  } else if (name.length < 3 || name.length > 30) {
    throw createError(400, 'Name is either less than 3 characters long or more than 30 characters long.');
  }

  for (const quiz of data.quizzes) {
    if (name === quiz.name) {
      throw createError(400, 'Name is already used by the current logged in user for another quiz.');
    }
  }

  quiz.name = name;
  setData(data);
  return {};
}

/**
 * Update quiz description.
 *
 * @param {string} token - the token of the current logged in admin user
 * @param {number} quizId - the id of the quiz
 * @param {string} description - the new description for the quiz
 * @returns {unknown}
 *
 */

export function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const userId = user.userId;
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (quiz.ownerId !== userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  if (description.length > 100) {
    throw createError(400, 'Description is more than 100 characters in length.');
  }

  quiz.description = description;
  setData(data);
  return {};
}

/**
 * View the quizzes in trash.
 *
 * @param {string} token - the token of the current logged in admin user
 * @returns {{ quizzes: {name: string, quizId: number}[] }}
 *
 */

export function adminQuizTrash(token: string): { quizzes: {name: string, quizId: number}[] } | { error: string } {
  const user = getUser(token);

  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
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
 * Restore a quiz from trash.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} token - the token of the current logged in admin user
 * @returns {unknown}
 *
 */

export function adminQuizRestore(quizId: number, token: string): unknown| {error: string} {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const trashQuizIndex = data.quizzesTrash.findIndex(q => q.quizId === quizId);
  if (trashQuizIndex === -1) {
    throw createError(400, 'Quiz ID refers to a quiz that is not currently in the trash.');
  }

  const trashQuiz = data.quizzesTrash[trashQuizIndex];
  const sameName = data.quizzes.some(q => q.name === trashQuiz.name);
  if (sameName) {
    throw createError(400, 'Quiz name of the restored quiz is already used by another active quiz.');
  }

  if (trashQuiz.ownerId !== user.userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  trashQuiz.timeLastEdited = Math.floor(Date.now() / 1000);
  data.quizzes.push(trashQuiz);

  // use splice remove test from trash and add it to the list.
  data.quizzesTrash.splice(trashQuizIndex, 1);
  setData(data);
  return {};
}

/**
 * Empty the trash.
 *
 * @param {string} token - the token of the current logged in admin user
 * @param {string} quizIds - a string representing a JSONified array of quiz id numbers
 * @returns {unknown}
 *
 */

export function adminQuizEmptyTrash(token: string, quizIds: string): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const quizIdJson = JSON.parse(quizIds);
  for (const quizId of quizIdJson) {
    // use quizId find each quiz from trash.
    const quizInTrash = data.quizzesTrash.find((quiz) => quizId === quiz.quizId);
    if (!quizInTrash) {
      // current quiz is not in trash.
      const quizNotInTrash = data.quizzes.find((quiz) => quizId === quiz.quizId);
      if (quizNotInTrash) {
        throw createError(400, 'One or more of the Quiz IDs is not currently in the trash.');
      }
    }

    if (quizInTrash.ownerId !== user.userId) {
      throw createError(403, 'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own.');
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
 * Transfer the quiz to another owner.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} token - the token of the current logged in admin user
 * @param {string} userEmail - the email of the user transfer the quiz to.
 * @returns {unknown}
 *
 */

export function adminQuizTransfer(quizId: number, token: string, userEmail: string): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  // Check quizId.
  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  const newOwner = data.users.find((user: User) => userEmail === user.email);
  if (!newOwner) {
    throw createError(400, 'userEmail is not a real user.');
  } else if (newOwner.userId === user.userId) {
    throw createError(400, 'userEmail is the current logged in user.');
  }

  if (quizNameIsTaken(newOwner.userId, quiz.name)) {
    throw createError(400, 'Quiz ID refers to a quiz that has a name that is already used by the target user.');
  }

  quiz.ownerId = newOwner.userId;
  setData(data);
  return {};
}

// Helper functions
/**
 * Checks if quiz name has already been used by the user.
 *
 * @param {number} authUserID - User Id
 * @param {string} name - Name to check
 * @returns {boolean} - true or false
 */

function quizNameIsTaken (authUserID: number, name: string): boolean {
  const data = getData();

  for (const quiz of data.quizzes) {
    if (quiz.ownerId === authUserID && quiz.name === name) {
      return true;
    }
  }

  return false;
}

/**
 * Create quiz question.
 *
 * @param {string} token - The token of the user creating the question.
 * @param {number} quizId - The ID of the quiz to create the question for.
 * @param {Question} questionBody - The details of the question to create.
 * @returns {{ questionId: number }}
 *
 */

export function adminQuestionCreate(token: string, quizId: number, questionBody: Question): { questionId: number } | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw createError(400, 'Question string is less than 5 characters in length or greater than 50 characters in length.');
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw createError(400, 'The question has more than 6 answers or less than 2 answers.');
  } else if (questionBody.duration <= 0) {
    throw createError(400, 'The question duration is not a positive number.');
  }

  // The sum of the question durations in the quiz exceeds 3 minutes
  const totalDuration = quiz.questions.reduce((acc, question) => acc + question.duration, 0);
  if (totalDuration + questionBody.duration > 180) {
    throw createError(400, 'The sum of the question durations in the quiz exceeds 3 minutes.');
  }

  // The points awarded for the question are less than 1 or greater than 10
  if (questionBody.points < 1 || questionBody.points > 10) {
    throw createError(400, 'The points awarded for the question are less than 1 or greater than 10.');
  }

  // The length of any answer is shorter than 1 character long, or longer than 30 characters long
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      throw createError(400, 'The length of any answer is shorter than 1 character long, or longer than 30 characters long');
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
    throw createError(400, 'Any answer strings are duplicates of one another.');
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
    throw createError(400, 'There are no correct answers.');
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
  return { questionId: questionId };
}

// Helper functions
/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {number} authUserID - user Id
 * @param {string} name - name to check
 * @returns {number} newId - new id of question
 */

function newQuestionsId(quiz: Quiz): number {
  let newId = 0;
  while (quiz.questions.some((question: Question) => question.questionId === newId)) {
    newId++;
  }

  return newId;
}

// Helper functions
/**
 * Update colours and time editied.
 *
 * @param {number} quizId - quizId
 * @param {string} name - Name to check
 */

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
 * Update quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {string} token - the token of the current logged in admin user
 * @param {Question} questionBody - The new details for the question.
 * @returns {unknown}
 *
 */

export function adminQuestionUpdate(token: string, quizId: number, questionId: number, questionBody: Question): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const userId = user.userId;
  const quizToUpdate = data.quizzes.find((quiz: Quiz) => quiz.quizId === quizId);
  if (!quizToUpdate || userId !== quizToUpdate.ownerId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  const questionToUpdate = quizToUpdate.questions.find((question: Question) => question.questionId === questionId);
  if (questionToUpdate === undefined) {
    throw createError(400, 'Question Id does not refer to a valid question within this quiz.');
  } else if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw createError(400, 'Question string is less than 5 characters in length or greater than 50 characters in length.');
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw createError(400, 'The question has more than 6 answers or less than 2 answers.');
  } else if (questionBody.duration <= 0) {
    throw createError(400, 'The question duration is not a positive number.');
  } else if (questionBody.points < 1 || questionBody.points > 10) {
    throw createError(400, 'The points awarded for the question are less than 1 or greater than 10.');
  } else if (questionBody.answers.some((answer: Answer) => answer.answer.length < 1 || answer.answer.length > 30)) {
    throw createError(400, 'The length of any answer is shorter than 1 character long, or longer than 30 characters long.');
  } else if (!questionBody.answers.some((answer: Answer) => answer.correct)) {
    throw createError(400, 'There are no correct answers.');
  }

  const answerStrings = questionBody.answers.map((answer: Answer) => answer.answer);
  if (new Set(answerStrings).size !== answerStrings.length) {
    throw createError(400, 'Any answer strings are duplicates of one another.');
  }

  // Calculate the total duration of all questions
  let totalDuration = questionBody.duration;
  for (const question of quizToUpdate.questions) {
    if (question.questionId !== questionId) {
      // Exclude the current question
      totalDuration += question.duration;
    }
  }

  // Include updated duration
  totalDuration += questionBody.duration;
  if (totalDuration > 180) {
    throw createError(400, 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes.');
  }

  // Update question
  questionToUpdate.question = questionBody.question;
  questionToUpdate.duration = questionBody.duration;
  questionToUpdate.points = questionBody.points;
  questionToUpdate.answers = questionBody.answers;
  setData(data);

  // Update quiz timeLastEdited + colours
  updateColoursAndTimeEditied(quizId, questionId);
  return {};
}

/**
 * Delete a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {string} token - the token of the current logged in admin user
 * @returns {unknown}
 *
 */

export function adminQuestionDelete(quizId: number, questionId: number, token: string): unknown | { error: string } {
  const data = getData();

  const user = getUser(token);
  if (user == null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  // Find the specified quiz
  const quiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!quiz || quiz.ownerId !== user.userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  // Find the index of the specified question in the quiz
  const questionIndex = quiz.questions.findIndex(q => q.questionId === questionId);
  // If the specified question is not found, return an error
  if (questionIndex === -1) {
    throw createError(400, 'Question Id does not refer to a valid question within this quiz.');
  }

  // Remove the question at the specified index
  quiz.questions.splice(questionIndex, 1);
  return {};
}

/**
 * Move a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {string} token - the token of the current logged in admin user
 * @param {number} newPosition - the new index position of the question within the quiz.
 *
 * @returns {unknown}
 */

export function adminQuizQuestionMove(quizId: number, questionId: number, token: string, newPosition: number): unknown | { error: string } {
  const data = getData();
  const user = getUser(token);
  if (user === null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  const userId = user.userId;
  // Attempt to locate the specified quiz
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Ensure the quiz exists
  if (!validQuiz) {
    throw createError(400, 'Question Id does not refer to a valid question within this quiz.');
  }

  // Verify that the user is the owner of the quiz
  if (validQuiz.ownerId !== userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  // Find the index of the question to be moved within the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Validate the new position is within acceptable bounds
  if (newPosition < 0 || newPosition >= validQuiz.questions.length) {
    throw createError(400, 'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions.');
  }

  // Check if the new position is the same as the current position
  if (newPosition === questionIndex) {
    throw createError(400, 'NewPosition is the position of the current question.');
  }

  // Perform the move operation: remove the question from its current position
  const [questionToUpdate] = validQuiz.questions.splice(questionIndex, 1);
  // And insert it at the new position
  validQuiz.questions.splice(newPosition, 0, questionToUpdate);
  // Update the last edited time of the quiz
  validQuiz.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

/**
 * Duplicate a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {string} token - the token of the current logged in admin user
 * @returns {{ newQuestionId: number }}
 *
 */

export function adminQuizQuestionDuplicate(quizId: number, questionId: number, token: string): { newQuestionId: number } | { error: string } {
  const data = getData();

  const user = getUser(token);
  console.log('NJF...', user);
  if (user == null) {
    throw createError(401, 'Token does not refer to valid logged in user quiz session.');
  }

  // Find the quiz object based on the provided quizId
  const validQuiz = data.quizzes.find(q => q.quizId === quizId);
  // Check if the quiz is owned by the current user
  if (validQuiz?.ownerId !== user.userId) {
    throw createError(403, 'Valid token is provided, but user is not an owner of this quiz.');
  }

  // Find the index of the question in the quiz
  const questionIndex = validQuiz.questions.findIndex(q => q.questionId === questionId);
  // Check if the question exists in the quiz
  if (questionIndex === -1) {
    throw createError(400, 'Question Id does not refer to a valid question within this quiz.');
  }

  // Create a new ID for the duplicated question
  const newQuestionId = newQuestionsId(validQuiz);
  // Duplicate the question
  const duplicatedQuestion = { ...validQuiz.questions[questionIndex], questionId: newQuestionId };
  // Insert the duplicated question into the quiz
  validQuiz.questions.splice(questionIndex + 1, 0, duplicatedQuestion);
  validQuiz.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return { newQuestionId: newQuestionId };
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
