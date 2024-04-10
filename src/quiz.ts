import { getData, setData } from "./dataStore";
import { User } from './dataStore.js';
import { getUser, getUserId } from './other'

// Description
// Provide a list of all quizzes that are owned by the currently logged in user.

/**
 * Finds the next possible Question Id avaliable for a specific quiz
 *
 * @param quiz - Quiz
 * @returns - Returns lowest possible Id
 */
function newQuestionsId(quiz: quiz): number {
  let newId = 0;
  while (quiz.questionBank.some((question: question) => question.questionId === newId)) {
    newId++;
  }
  return newId;
}

/**
 *
 * @param quizId - quiz in question
 * @param questionId - question needing to be updated
 */
function updateColoursAndTimeEditied (quizId: number, questionId: number) {
  const data = getData();
  const quiz = data.quizzes.find((quiz: quiz) => quizId === quiz.quizId);

  const colourKeys = Object.keys(Colours);
  const indexOfQuestion = quiz.questionBank.findIndex((question: question) => question.questionId === questionId);

  for (const answer of quiz.questionBank[indexOfQuestion].answers) {
    // Randomly selects a colour
    const randomIndex = Math.floor(Math.random() * colourKeys.length);
    answer.colour = Colours[colourKeys[randomIndex]];
  }

  // Updates time last edited
  quiz.timeLastEdited = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

  const indexOfQuiz = data.quizzes.findIndex((quiz: quiz) => quizId === quiz.quizId);
  if (indexOfQuiz !== -1) {
    data.quizzes[indexOfQuiz] = quiz;
  }
  setData(data);
}





// Description:
// Given basic details about a new quiz, create one for the logged in user.

/**
 * 
 * @param {string} token - Id of user after registration
 * @param {string} name - New quiz's name
 * @param {string} description - New quiz's description
 * @returns {{ quizId: number }} - An object contains the new quizId after creating a quiz
 *
 */

export function adminQuizCreate(token: string, name: string, description: string): { quizId: number} | ErrorResponse {
    const data = getData();

    // Check userId by token.
    const newUser = getUser(token);
    if (newUser === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const tokenId = getUserId(token);
    if (tokenId === null) {
        return { error: 'Token does not refer to valid logged in user session' };
    } 

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
        if (name === quiz.name) {
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

export function adminQuizInfo(token: string, quizId: number): QuizInfoResponseV1 | ErrorResponse{
    const data = getData();

    // Check userId by token.
    const user = getUser(token);
    if (!user) {
        // Token is empty.
        return { error: 'Token does not refer to valid logged in user session' };
    } 

    const userId = getUserId(token);
    if (!userId) {
        // Token is invalid.
        return { error: 'Token does not refer to valid logged in user session' };
    }

    // Check quizId.
    const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
    if (!quiz) {
        return { error: 'Quiz ID does not refer to a valid quiz' };
    } else if (quiz.ownerId !== userId) {
        return { error: 'Quiz ID does not refer to a quiz that this user owns' };
    }

    // Return quiz info.
    return {
        quizId: quiz.quizId,
        name: quiz.name,
        timeCreated: quiz.timeCreated,
        timeLastEdited: quiz.timeLastEdited,
        description: quiz.description,
        /*
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
        */
    };
}


// Description
// Update the name of the specified quiz.




// export function adminQuizNameUpdate(token: string, quizId: number, name: string): {} | ErrorResponse {
//     const data = getData();

//     // Check userId by token.
//     const newUser = getUser(token);
//     if (newUser === null) {
//         return { error: 'Token does not refer to valid logged in user session' };
//     } 

//     const tokenId = getUserId(token);
//     if (tokenId === null) {
//         return { error: 'Token does not refer to valid logged in user session' };
//     } 

//     // Check quizId.
//     const quiz = data.quizzes.find((quiz) => quiz.quizId === quizId);
//     if (!quiz) {
//         return { error: 'Quiz ID does not refer to a valid quiz' };
//     } else if (quiz.ownerId !== userId) {
//         return { error: 'Quiz ID does not refer to a quiz that this user owns' };
//     }

//     // Check name.
//     const nameFormat = /^[a-zA-Z0-9\s]*$/;
//     if (nameFormat.test(name) !== true) {
//         return { error: 'Name contains invalid characters' };
//     } else if (name.length < 3) {
//         return { error: 'Name is less than 3 characters long' };
//     } else if (name.length > 30) {
//         return { error: 'Name is more than 30 characters long' };
//     }

//     for (const quiz of data.quizzes) {
//         if (name === quiz.name) {
//             return { error: 'Name is already used by the current logged in user for another quiz' };    
//         }
//     }

//     // Update name of quiz.
//     quiz.name = name;
//     setData(data);
//     return {};
// }






//helper function
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
    if (quiz.userId === userID && quiz.quizName === name) {
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
  const data = getData();

  // 使用token获取userId
  const userId = getUserId(token); // 假设getUserId是一个已定义的函数，用于解析token并返回用户ID

  const quiz = data.quizzes.find((quiz: any) => quizId === quiz.quizId);
  const newOwner = data.users.find((user: any) => userEmail === user.email);
  if (newOwner === undefined) {
    return {
      error: 'userEmail is not a real user'
    };
  } else if (newOwner.userId === userId) {
    return {
      error: 'userEmail is the current logged in user'
    };
  }

  if (quizNameIsTaken(newOwner.userId, quiz.quizName)) {
    return {
      error: 'Quiz Id refers to a quiz that has a name that is already used by the target user'
    };
  }
  const nonEndSessions = data.sessions.filter((session: any) => session.quizId === quizId && session.state !== 'END');
  if (nonEndSessions.length > 0) {
    return { error: 'Any session for this quiz is not in END state' };
  }

  // 需要在未来检查测验是否处于END状态

  // 所有检查完成 - 将测验移交给新所有者
  // 1. 更改测验作者
  data.quizzes.find((quiz: any) => quiz.quizId === quizId).authorUserId = newOwner.userId;
  // 2. 将测验ID添加到新所有者的数组中
  data.users.find((user: any) => user === newOwner).quizzesCreated.push(quizId);
  // 3. 从之前所有者的数组中移除测验ID
  const previousOwner = data.users.find((user: any) => user.userId === userId);
  const quizIdIndex = previousOwner.quizzesCreated.findIndex((Id: number) => Id === quizId);
  if (quizIdIndex !== -1) {
    previousOwner.quizzesCreated.splice(quizIdIndex, 1);
  }
  setData(data); // 假设setData是一个已定义的函数，用于更新数据
  return {};
}





/**
 * Create a new stub question for a particular quiz.
 * When this route is called, and a question is created, the timeLastEdited is set as the same as the created time, 
 * and the colours of all answers of that question are randomly generated.
 * @param token Id of user
 * @param quizId Id of quiz
 * @param questionBody question string
 * @returns questionId
 */

export function adminQuestionCreate (token: string, quizId: number, questionBody: any) {
  const data = getData();
  const userId = getUserId(token);
  //if QUuiz is not found
  const quiz = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quiz === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  //Question string check
  if (
    questionBody.question.length > 50 || questionBody.question.length < 5) {
    return {
      error: 'Question string is less than 5 characters in length or is greater than 50 characters in length'
    };
  }

  //Question number of answer check
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers'
    };
  }
  //Duration is positive
  if (questionBody.duration <= 0) {
    return {
      error: 'The question duration is not a positive number'
    };
  }
  //The sum of the question durations in the quiz exceeds 3 minutes
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
  //The length of any answer is shorter than 1 character long, or longer than 30 characters long
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return {
        error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long'
      };
    }
  }
  //Any answer strings are duplicates of one another (within the same question)
  const duplicates = (answer: option[]) => {
    const seen = new Set();
    for (const option of answer) {
      if (seen.has(option.answer)) {
        return true;
      }
      seen.add(option.answer);
    }
    return false;
  }
  if (duplicates(questionBody.answers)) {
    return {
      error: 'This answer strings are duplicates of one another'
    };
  }
  //There are no correct answers
  const checkAnswer = (answers: option[]) => {
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

  //Make a new update to data
  const questionId = newQuestionsId (quiz);
  const newQuestion: question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: questionBody.answers,
  };
  const indexOfQuiz = data.quizzes.findIndex((quiz: quiz) => quiz.quizId === quizId);
  if (indexOfQuiz !== -1) {
    data.quizzes[indexOfQuiz] = quiz;
  }
  setData(data);
  //Update the time last edited and colours of the answers
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

export function adminQuestionUpdate(authUserId: number, quizId: number, questionId: number, questionBody: any): any {
  const data = getData();
  const userId = getUserId(token);
  const quizToUpdate = data.quizzes.find((quiz: quiz) => quiz.quizId === quizId);
  if (quizToUpdate === undefined) {
    return {
      error: 'Quiz Id does not refer to a valid quiz'
    };
  }

  const user = data.users.find((user: user) => user.userId === authUserId);
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


