import { getData, setData } from './dataStore';

/**
 * Update the name of the specified quiz.
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


function adminQuizNameUpdate(token: string, quizId: number, name: string) {
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



