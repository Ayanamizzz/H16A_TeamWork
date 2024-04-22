import { getData, setData } from './dataStore';
import { user, Colours, option, question, quiz, iniQuizzes, State, Action } from './dataStore';
import { format } from 'date-fns';
import { port, url } from './config.json';
import request from 'sync-request';
import fs from 'fs';
import rn from 'random-number';

const SERVER_URL = `${url}:${port}`;
const COUNTDOWNTIMER = 100; // Note this is 0.1 seconds

/**
 * Lists all user's quizzes.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns The list of quizzes
 *
 */
export function adminQuizList(authUserId: number) {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);

  const userQuizIds = user.quizzesCreated;
  const returnObject: iniQuizzes = {
    quizzes: []
  };

  for (const Id of userQuizIds) {
    const quiz = dataStore.quizzes.find((quiz: quiz) => Id === quiz.quizId);
    returnObject.quizzes.push({
      quizId: quiz.quizId,
      name: quiz.quizName
    });
  }

  return returnObject;
}

/**
 * Create a new quiz.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} name - the name of new quiz
 * @param {string} description - the description of new quiz
 * @returns an object contains the new quizId after creating a quiz
 *
 */
export function adminQuizCreate (authUserId:number, name:string, description:string) {
  const dataStore = getData();
  const quizzes = dataStore.quizzes;
  const users = dataStore.users;
  const user = users.find((user: user) => user.userId === authUserId);
  if (/[^a-zA-Z0-9\s]/.test(name)) {
    return { error: 'name must only contain alphanumeric characters' };
  } else if (name.length < 3) {
    return { error: 'name must be longer than 3 characters' };
  } else if (name.length > 30) {
    return { error: 'name cannot be longer than 30 characters' };
  } else if (quizNameIsTaken(authUserId, name)) {
    return { error: 'name is already by another quiz by current user' };
  } else if (description.length > 100) {
    return { error: 'description cannot be longer than 100 characters' };
  }
  const newQuizId = getNewQuizId();
  quizzes.push({
    quizName: name,
    quizId: newQuizId,
    description: description,
    authorUserId: authUserId,
    questionBank: [],
    timeCreated: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    timeLastEdited: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    thumbnailUrl: ''
  });
  user.quizzesCreated.push(newQuizId);
  setData(dataStore);
  return { quizId: newQuizId };
}

/**
 * Send a quiz to trash.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns empty object
 *
 */
export function adminQuizRemove (authUserId: number, quizId:number) {
  const storeData = getData();

  const user = storeData.users.find((user: user) => user.userId === authUserId);
  const quiz = storeData.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }
  const ownQuizzes = user.quizzesCreated;

  if (!ownQuizzes.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    };
  }

  const userQuizToRemove = ownQuizzes.findIndex((quiz:number) => quiz === quizId);
  storeData.users.find((targetUser: user) => targetUser.userId === authUserId).quizzesCreated.splice(userQuizToRemove, 1);

  // Remove from quizzes
  const indexOfDataStoreQuizToRemove = storeData.quizzes.findIndex((quiz: quiz) => quiz.quizId === quizId);
  storeData.quizzes.splice(indexOfDataStoreQuizToRemove, 1);

  // Add to trash
  storeData.trash.push(quiz);

  setData(storeData);
  return { };
}

/**
 * Get info about current quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} authUserId - the userId of the current logged in admin user
 * @return details of the quiz (quizId, name, timeCreated, timeLastEdited, description)
 *
 */
export function adminQuizInfo (authUserId:number, quizId:number) {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  const quiz = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    };
  }
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz this user owns'
    };
  }
  return {
    quizId: quiz.quizId,
    name: quiz.quizName,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    thumbnailUrl: quiz.thumbnailUrl
  };
}

/**
 * Get info about current quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} name - the new name for the quiz.
 * @returns empty object
 *
 */
export function adminQuizNameUpdate(authUserId:number, quizId:number, name:string) {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  const quiz = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId does not refer to a valid quiz' };
  }
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return { error: 'quizId does not refer to a quiz that this user owns' };
  } else if (/[^a-zA-Z0-9\s]/.test(name)) {
    return { error: 'name must not contain characters that are not alphanumeric or spaces' };
  } else if (name.length < 3) {
    return { error: 'name must be longer than 3 characters' };
  } else if (name.length > 30) {
    return { error: 'name must be less than 30 characters' };
  } else if (quizNameIsTaken(authUserId, name)) {
    return { error: 'name is already used by current logged in user for another quiz' };
  }
  quiz.quizName = name;
  setData(dataStore);
  return { };
}

/**
 * Update quiz description.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {number} quizId - the id of the quiz
 * @param {string} description - the new description for the quiz
 * @returns empty object
 *
 */
export function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string) {
  const storeData = getData();
  const user = storeData.users.find((user: user) => user.userId === authUserId);
  const quiz = storeData.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  // error checking
  // loop through data.quizzes, until quizID matches to find quiz object
  // quiz.description = description
  //  setData(data)

  if (quiz === undefined) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    };
  }

  const ownQuizzes = user.quizzesCreated;

  if (!ownQuizzes.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    };
  }
  if (description.length > 100) {
    return {
      error: 'Description is more than 100 characters in length (note: empty strings are OK)'
    };
  } else {
    quiz.description = description;
    setData(storeData);
    return { };
  }
}

/**
 * View the quizzes in trash.
 *
 * @param {number} authUserID - the userId of the current logged in admin user
 * @returns quizzes: userTrash
 *
 */
export function adminQuizTrash(authUserID: number) {
  const data = getData();
  const userTrash = [];
  for (const quiz of data.trash) {
    if (quiz.authorUserId === authUserID) {
      userTrash.push({
        quizId: quiz.quizId,
        name: quiz.quizName
      });
    }
  }
  return { quizzes: userTrash };
}

/**
 * Restore a quiz from trash.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns if successful and an error if called incorrectly
 *
 */
export function adminQuizRestore (authUserId: number, quizId: number) {
  const data = getData();

  // If quiz exists or is not in trash
  const quizInTrash = data.trash.find((quiz: quiz) => quiz.quizId === quizId);
  if (quizInTrash === undefined) {
    const quizNotInTrash = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
    if (quizNotInTrash === undefined) {
      return {
        error: 'Quiz Id does not refer to a valid quiz'
      };
    } else {
      return {
        error: 'Quiz Id refers to a quiz that is not currently in the trash'
      };
    }
  }

  // If users owns quiz
  if (quizInTrash.authorUserId !== authUserId) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  // Move from trash back into quizzes array
  data.quizzes.push(quizInTrash);
  // Add Quiz Id back into user owned array
  data.users.find((user: user) => authUserId === user.userId).quizzesCreated.push(quizId);

  // Splice from trash
  const indexToRemove = data.trash.findIndex((quiz: quiz) => quiz.quizId === quizId);
  data.trash.splice(indexToRemove, 1);

  setData(data);
  return {};
}

/**
 * Empty the trash.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} quizIds - a string representing a JSONified array of quiz id numbers
 * @returns empty object or error
 *
 */
export function adminQuizEmptyTrash (authUserId: number, quizIds: number[]) {
  const data = getData();

  for (const quizId of quizIds) {
    // Check existence + place of quizzes
    const quiz = data.trash.find((quiz: quiz) => quizId === quiz.quizId);
    if (quiz === undefined) {
      const quizNotInTrash = data.quizzes.find((quiz: quiz) => quizId === quiz.quizId);
      if (quizNotInTrash === undefined) {
        return {
          error: 'One or more of the Quiz Ids is not a valid quiz'
        };
      } else {
        return {
          error: 'One or more of the Quiz Ids is not currently in the trash'
        };
      }
    }

    // Check ownership
    if (quiz.authorUserId !== authUserId) {
      return {
        error: 'One or more of the Quiz Ids refers to a quiz that this current user does not own'
      };
    }

    // Delete
    const quizIndex = data.trash.findIndex((quiz: quiz) => quizId === quiz.quizId);
    data.trash.splice(quizIndex, 1);
  }

  setData(data);
  return {};
}

/**
 * Transfer the quiz to another owner.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {string} userEmail - the email of the user transfer the quiz to
 * @returns error or empty object
 *
 */
export function adminQuizTransfer (authUserId: number, quizId: number, userEmail: string) {
  const data = getData();

  const quiz = data.quizzes.find((quiz: quiz) => quizId === quiz.quizId);
  if (quiz === undefined) {
    // Note this error message will also be given if the quiz is in the trash
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }
  if (quiz.authorUserId !== authUserId) {
    return {
      error: 'Quiz Id does not refer to a quiz this user owns'
    };
  }

  const newOwner = data.users.find((user: user) => userEmail === user.email);
  if (newOwner === undefined) {
    return {
      error: 'userEmail is not a real user'
    };
  } else if (newOwner.userId === authUserId) {
    return {
      error: 'userEmail is the current logged in user'
    };
  }

  if (quizNameIsTaken(newOwner.userId, quiz.quizName)) {
    return {
      error: 'Quiz Id refers to a quiz that has a name that is already used by the target user'
    };
  }

  // Need to check in future if quiz is in END state

  // All checks done - move quizz to owner
  // 1. Change quiz author
  data.quizzes.find((quiz: quiz) => quiz.quizId === quizId).authorUserId = newOwner.userId;
  // 2. Add quizzId to new Owner array
  data.users.find((user: user) => user === newOwner).quizzesCreated.push(quizId);
  // 3. Remove quizId from previous owner array
  const previousOwner = data.users.find((user: user) => user.userId === authUserId);
  const quizIdIndex = previousOwner.quizzesCreated.findIndex((Id: number) => Id === quizId);
  data.users.find((user: user) => user.userId === authUserId).quizzesCreated.splice(quizIdIndex, 1);
  setData(data);
  return {};
}

/**
 * Create quiz question.
 *
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {number} quizId - The ID of the quiz to create the question for
 * @param {any} questionBody - The details of the question to create
 * @returns questionId
 *
 */
export function adminQuizCreateQuestion (authUserId: number, quizId: number, questionBody: any) {
  const data = getData();

  // Quiz exists
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  // Caller owns quiz
  const ownerId = quiz.authorUserId;
  if (ownerId !== authUserId) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  // Question string
  if (
    questionBody.question.length > 50 ||
    questionBody.question.length < 5
  ) {
    return {
      error: 'Question string is less than 5 characters in length or is greater than 50 characters in length'
    };
  }

  // Number of answers
  if (
    questionBody.answers.length > 6 ||
    questionBody.answers.length < 2
  ) {
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

  // Quiz questions exceed 3 minutes
  const durationSum = (quiz: quiz, newDuration: number) => {
    let sum = 0;
    for (const question of quiz.questionBank) {
      sum += question.duration;
    }
    sum += newDuration;
    return sum;
  };
  if (durationSum(quiz, questionBody.duration) > 180) {
    return {
      error: 'The sum of the question durations in the quiz exceeds 3 minutes'
    };
  }

  // Points are < 1 or > 10
  if (
    questionBody.points < 1 ||
    questionBody.points > 10
  ) {
    return {
      error: 'The points awarded for the question are less than 1 or are greater than 10'
    };
  }

  // Length of any answer is < 1 or > 30 characters
  for (const entry of questionBody.answers) {
    if (
      entry.answer.length < 1 ||
      entry.answer.length > 30
    ) {
      return {
        error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long'
      };
    }
  }

  // Any answers strings are duplicates
  const duplicates = (answers: option[]) => {
    const uniqueAnswers = new Set<string>();
    for (const answer of answers) {
      if (uniqueAnswers.has(answer.answer)) {
        return true;
      }
      uniqueAnswers.add(answer.answer);
    }
    return false;
  };
  if (duplicates(questionBody.answers)) {
    return {
      error: 'One or more answer strings are duplicates'
    };
  }

  // If an answer is included
  const includesAnswer = (answers: option[]) => {
    for (const answer of answers) {
      if (answer.correct === true) {
        return true;
      }
    }
    return false;
  };
  if (!includesAnswer(questionBody.answers)) {
    return { error: 'There are no correct answers' };
  }

  const createQuestionId = newQuestionId(quiz);
  const fileExtension = questionBody.thumbnailUrl.split('.').pop().toLowerCase();

  if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
    return { error: 'imageUrl must return PNG or JPG' };
  }

  const res = request('GET', questionBody.thumbnailUrl);
  const body = res.getBody();
  fs.writeFileSync(`./images/q${quizId}_${createQuestionId}.${fileExtension}`, body, { flag: 'w' });

  const url = `${SERVER_URL}/images/q${quizId}_${createQuestionId}.${fileExtension}`;
  // Make updates to data
  // 1. Add in bulk of details - will not add question colour or update tim
  quiz.questionBank.push({
    questionId: createQuestionId,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: questionBody.answers,
    question: questionBody.question,
    thumbnailUrl: url,
  });
  const indexOfQuiz = data.quizzes.findIndex((quiz: quiz) => quiz.quizId === quizId);
  data.quizzes[indexOfQuiz] = quiz;
  setData(data);

  // 2. Call function to update colours + timelasteditied
  // Note: Data must be set before calling this function as it asks for data again
  updateColoursAndTimeEditied(quizId, createQuestionId);

  return { questionId: createQuestionId };
}

/**
 * Update quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {any} questionBody - The new details for the question.
 * @returns error or empty object
 *
 */

export function adminQuizQuestionUpdate(authUserId: number, quizId: number, questionId: number, questionBody: any): any {
  const dataStore = getData();
  const quizToUpdate = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quizToUpdate === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  if (!user.quizzesCreated.includes(quizId)) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  const questionToUpdate = quizToUpdate.questionBank.find((question: question) => question.questionId === questionId);
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

  if (questionBody.answers.some((answer: any) => answer.answer.length < 1 || answer.answer.length > 30)) {
    return {
      error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long'
    };
  }

  const answerStrings = questionBody.answers.map((answer: any) => answer.answer);
  if (new Set(answerStrings).size !== answerStrings.length) {
    return {
      error: 'Any answer strings are duplicates of one another (within the same question)'
    };
  }

  if (!questionBody.answers.some((answer: any) => answer.correct)) {
    return {
      error: 'There are no correct answers'
    };
  }

  // Calculate the total duration of all questions
  let totalDuration = questionBody.duration;
  for (const question of quizToUpdate.questionBank) {
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

  const fileExtension = questionBody.thumbnailUrl.split('.').pop().toLowerCase();

  if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
    return { error: 'imageUrl must return PNG or JPG' };
  }

  const res = request('GET', questionBody.thumbnailUrl);
  const body = res.getBody();
  fs.writeFileSync(`./images/q${quizId}_${questionId}.${fileExtension}`, body, { flag: 'w' });

  const url = `${SERVER_URL}/images/q${quizId}_${questionId}.${fileExtension}`;

  // Update question
  questionToUpdate.question = questionBody.question;
  questionToUpdate.duration = questionBody.duration;
  questionToUpdate.points = questionBody.points;
  questionToUpdate.answers = questionBody.answers;
  questionToUpdate.thumbnailUrl = url;

  // Write data back to dataStore
  setData(dataStore);

  // Update quiz timeLastEdited + colours
  updateColoursAndTimeEditied(quizId, questionId);

  return {};
}

/**
 * Delete a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns error or empty object
 *
 */
export function adminQuizQuestionDelete(authUserId: number, quizId: number, questionId: number) {
  const storeData = getData();

  const user = storeData.users.find((user: user) => user.userId === authUserId);
  const quiz = storeData.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  // Check if the user owns the quiz
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  // Find the question to remove
  const questionIndex = quiz.questionBank.findIndex((question: question) => question.questionId === questionId);
  if (questionIndex === -1) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz'
    };
  }

  // Remove the question from the quiz
  quiz.questionBank.splice(questionIndex, 1);
  setData(storeData);
  return { };
}

/**
 * Move a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {number} newPosition - the new index position of the question within the quiz.
 * @returns error or empty object
 */
export function adminQuizQuestionMove(authUserId: number, quizId: number, questionId: number, newPosition: number) {
  const storeData = getData();

  const user = storeData.users.find((user: user) => user.userId === authUserId);
  const quiz = storeData.quizzes.find((quiz: quiz) => quiz.quizId === quizId);

  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  // Check if the user owns the quiz
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  // Find the question to move
  const questionIndex = quiz.questionBank.findIndex((question: question) => question.questionId === questionId);
  if (questionIndex === -1) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz'
    };
  }

  // Validate newPosition
  if (newPosition < 0 || newPosition >= quiz.questionBank.length) {
    return {
      error: 'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions'
    };
  } else if (newPosition === questionIndex) {
    return {
      error: 'NewPosition is the position of the current question'
    };
  }

  // Move the question to the new position
  const [questionToMove] = quiz.questionBank.splice(questionIndex, 1);
  quiz.questionBank.splice(newPosition, 0, questionToMove);

  // Update time last edited
  quiz.timeLastEdited = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

  setData(storeData);
  return { };
}

/**
 * Duplicate a quiz question.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} questionId - the id of the question to update.
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns The new question id if successful and an error if called incorrectly
 *
 */
export function adminQuizQuestionDuplicate(authUserId: number, quizId: number, questionId: number) {
  const data = getData();

  // Verify the quiz
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  // Verify the user owns the quiz
  if (quiz.authorUserId !== authUserId) {
    return {
      error: 'Quiz Id does not refer to a quiz that this user owns'
    };
  }

  // Find the question to duplicate
  const questionIndex = quiz.questionBank.findIndex((question: question) => question.questionId === questionId);
  if (questionIndex === -1) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz'
    };
  }

  // Duplicate the question
  const sourceQuestion = quiz.questionBank[questionIndex];
  const newQuestion = { ...sourceQuestion, questionId: newQuestionId(quiz) };

  // Insert the duplicated question immediately after the source question
  quiz.questionBank.splice(questionIndex + 1, 0, newQuestion);

  // Update time last edited
  quiz.timeLastEdited = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

  setData(data);
  return { newQuestionId: newQuestion.questionId };
}

/**
 * Update the thumbnail for the quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @param {string} imgUrl - e.g "http://google.com/some/image/path.jpg"
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns Empty object
 *
 */
export const changeThumbnail = (imgUrl: string, quizId: number, authUserId: number) => {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  const quiz = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId does not refer to a valid quiz' };
  }
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return { error: 'quizId does not refer to a quiz that this user owns' };
  }

  const fileExtension = imgUrl.split('.').pop().toLowerCase();

  if (fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
    return { error: 'imageUrl must return PNG or JPG' };
  }

  const res = request('GET', imgUrl);
  const body = res.getBody();
  fs.writeFileSync(`./images/q${quizId}.${fileExtension}`, body, { flag: 'w' });

  quiz.thumbnailUrl = `${SERVER_URL}/images/q${quizId}.${fileExtension}`;
  setData(dataStore);
  return {};
};

/**
 * Retrieves active and inactive session ids (sorted in ascending order) for a quiz.
 *
 * @param {number} quizId - the id of the quiz
 * @returns Active and non active sessions quiz is apart of
 *
 */
export const viewSession = (quizId: number) => {
  const dataStore = getData();
  const validSessions = dataStore.quizSessions.filter((session: any) => session.metadata.quizId === quizId);

  const activeSessions = validSessions.filter((session: any) => session.state !== State.END);
  const inactiveSessions = validSessions.filter((session: any) => session.state === State.END);

  const activeIds = activeSessions.map((session: any) => session.sessionId);
  const inactiveIds = inactiveSessions.map((session: any) => session.sessionId);

  activeIds.sort((a: any, b: any) => a - b);
  inactiveIds.sort((a: any, b: any) => a - b);

  return {
    activeSessions: activeIds,
    inactiveSessions: inactiveIds
  };
};

/**
 * This copies the quiz, so that any edits whilst a session is running does not affect active session.
 *
 * @param {number} quizId - the id of the quiz
 * @param {number} autoStartNum - autoStartNum
 * @param {number} authUserId - the userId of the current logged in admin user
 * @returns new sessionId
 *
 */
export const newSession = (quizId: number, authUserId: number, autoStartNum: number) => {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  const quiz = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId does not refer to a valid quiz' };
  }
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return { error: 'quizId does not refer to a quiz that this user owns' };
  }
  if (autoStartNum > 50) {
    return { error: 'autoStartNum mast be less than 50' };
  } else if (quiz.questionBank.length <= 0) {
    return { error: 'quiz must have at least 1 question' };
  }
  const nActiveSessions = dataStore.quizSessions.filter((session: any) => session.state !== State.END).length;
  if (nActiveSessions >= 10) {
    return { error: 'already 10 sessions that are not in END state currently exist' };
  }
  const newSessionId = rn({ min: 0, max: 100000, integer: true });
  dataStore.quizSessions.push({
    sessionId: newSessionId,
    autoStartNum: autoStartNum,
    state: State.LOBBY,
    atQuestion: 0,
    players: [],
    metadata: quiz,
    messages: [],
  });
  setData(dataStore);
  return { sessionId: newSessionId };
};

/**
 * Update the state of a particular quiz session by sending an action command.
 *
 * @param {number} quizId - the id of the quiz
 * @param {any} action - action
 * @param {number} authUserId - the userId of the current logged in admin user
 * @param {number} sessionId - the session id
 * @returns empty object
 *
 */
export const updateSessionState = (quizId: number, authUserId: number, sessionId: number, action: any) => {
  const dataStore = getData();
  const user = dataStore.users.find((user: user) => user.userId === authUserId);
  const quiz = dataStore.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return { error: 'quizId does not refer to a valid quiz' };
  }
  const ownQuizzes = user.quizzesCreated;
  if (!ownQuizzes.includes(quizId)) {
    return { error: 'quizId does not refer to a quiz that this user owns' };
  }
  const sessionsWithQuiz = dataStore.quizSessions.filter((session: any) => session.metadata.quizId === quizId);

  const session = dataStore.quizSessions.find((session: any) => session.sessionId === sessionId);
  if (sessionsWithQuiz.length <= 0 || session === undefined) {
    return { error: 'Session Id does not refer to a valid session within this quiz' };
  }
  if (!Object.values(Action).includes(action)) {
    return { error: 'action is not valid Action' };
  }

  if (action === Action.NEXT_QUESTION) {
    if (session.state !== State.LOBBY && session.state !== State.QUESTION_CLOSE && session.state !== State.ANSWER_SHOW) {
      return { error: `Action enum cannot be applied in the current state (${session.state})` };
    }
    if (session.atQuestion - 1 === session.metadata.questionBank.length) {
      session.state = State.FINAL_RESULTS;
    } else {
      // Go to next question -> set a timer for 0.1 seconds of countdown -> timer of duration of question -> close question
      if (session.state !== State.LOBBY) session.atQuestion++;
      session.state = State.QUESTION_COUNTDOWN;
      moveState(sessionId, State.QUESTION_OPEN, COUNTDOWNTIMER);
    }
  } else if (action === Action.GO_TO_ANSWER) {
    if (session.state !== State.QUESTION_OPEN && session.state !== State.QUESTION_CLOSE) {
      return { error: `Action enum cannot be applied in the current state (${session.state})` };
    }
    session.state = State.ANSWER_SHOW;
  } else if (action === Action.GO_TO_FINAL_RESULTS) {
    if (session.state !== State.QUESTION_CLOSE && session.state !== State.ANSWER_SHOW) {
      return { error: `Action enum cannot be applied in the current state (${session.state})` };
    }
    session.state = State.FINAL_RESULTS;
  } else if (action === Action.END) {
    session.state = State.END;
  } else if (
    action === Action.FINISH_COUNTDOWN &&
    session.state === State.QUESTION_COUNTDOWN
  ) {
    session.state = State.QUESTION_OPEN;
    const question = session.metadata.questionBank[session.atQuestion];
    moveState(sessionId, State.QUESTION_CLOSE, question.duration);
  }
  setData(dataStore);
  return {};
};

/**
 * Moves session to another state after miliseconds
 * @param sessionId Session Id
 * @param targetState new State for session
 * @param milliseconds when to move session to that state
 */
function moveState(sessionId: number, targetState: State, milliseconds: number) {
  // Set time to change state
  setTimeout(() => {
    const data = getData();
    const session = data.quizSessions.find((session: any) => session.sessionId === sessionId);
    if (session === undefined) return;
    if (session.state === State.QUESTION_CLOSE) return;

    session.state = targetState;
    setData(data);

    if (targetState === State.QUESTION_OPEN) {
      // Set another timeout for QUESTIONCLOSE
      const questionDuration = session.metadata.questionBank[session.atQuestion].duration * 1000;

      setTimeout(() => {
        const dataStore = getData();
        const session1 = data.quizSessions.find((session: any) => session.sessionId === sessionId);
        if (session1 === undefined) return;
        if (session1.state === State.QUESTION_CLOSE) return;

        session1.state = State.QUESTION_CLOSE;
        setData(dataStore);
      }, questionDuration);
    }
  }, milliseconds);
}


