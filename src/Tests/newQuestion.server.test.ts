
import { clear } from './other';
import { registerReq, reqNewQuiz, reqNewQuestion } from './api';

clear();
const user1Token = registerReq('user@gmail.com', 'Abc123456', 'User', 'Admin');
const user1Quiz1 = reqNewQuiz('quiz1', 'description', user1Token.token);

describe('POST/v1/admin/quiz/{quizid}/question', () => {
  describe('Error Cases', () => {
    test('Quiz Id does not refer to a valid quiz', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId - 1000,
        {
          thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
          questionBody: {
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      const user2Token = registerReq('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user2Token.token
      );
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a quiz that this user owns' });
    });

    test('Question string is less than 5 characters in length or is greater than 50 characters in length', () => {
      const response1 = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'tttt',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response1).toStrictEqual({ error: 'Question string is less than 5 characters in length or is greater than 50 characters in length' });
    });

    test('The question has more than 6 answers or less than 2 answers', () => {
      const response1 = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              },
              {
                answer: 'Bobby',
                correct: false
              },
              {
                answer: 'Lebron James',
                correct: false
              },
              {
                answer: 'Michael Jordan',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response1).toStrictEqual({ error: 'The question has more than 6 answers or less than 2 answers' });
    });

    test('The question duration is not a positive number', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: -2,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'The question duration is not a positive number' });
    });

    test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 400,
            points: 5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'The sum of the question durations in the quiz exceeds 3 minutes' });
    });

    test('The points awarded for the question are less than 1 or are greater than 10', () => {
      const response1 = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 0.5,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response1).toStrictEqual({ error: 'The points awarded for the question are less than 1 or are greater than 10' });
    });

    test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
      const response1 = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: '',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response1).toStrictEqual({ error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long' });
    });

    test('One or more answer strings are duplicates', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'King Charles',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'One or more answer strings are duplicates' });
    });

    test('There are no correct answers', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: false
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'There are no correct answers' });
    });

    test('Token is not a valid structure', () => {
      const response = reqNewQuestion(
        1,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        }
      );
      expect(response).toStrictEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const response = reqNewQuestion(
        1,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Who is the Monarch of England?',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        '1234'
      );
      expect(response).toStrictEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });
    test('thumbnailUrl is not a png or jpg', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            question: 'Who is the Monarch of England?',
            thumbnailUrl: '',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'imageUrl must return PNG or JPG' });
    });
  });

  describe('Success Cases', () => {
    test('Returns questionId and sets answer to random colour', () => {
      const response = reqNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
            question: 'Who is the Monarch of England?',
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'King Charles',
                correct: true
              },
              {
                answer: 'King Phillip',
                correct: false
              },
              {
                answer: 'Queen Elizabeth',
                correct: false
              },
              {
                answer: 'Bob',
                correct: false
              }
            ]
          }
        },
        user1Token.token
      );
      expect(response).toStrictEqual({ questionId: expect.any(Number) });
    });
  });
});

afterAll(() => {
  clear();
});
