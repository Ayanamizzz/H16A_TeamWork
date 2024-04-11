import { User, getData, setData, Answer, Quiz, Question } from './dataStore';
import { getUser } from './other';


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
