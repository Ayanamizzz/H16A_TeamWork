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
 * @returns {QuizInfoResponseV1 | ErrorResponse} - An object containing quiz information if successful, or an error object if not.
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



