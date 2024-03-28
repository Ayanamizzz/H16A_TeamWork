import { getData, setData } from './dataStore';
import { getUser, getUserId } from './other'

/**
 * Updates the description of a specific quiz.
 * 
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

function adminQuizDescriptionUpdate(token: string, quizId: number, description: string) {
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






