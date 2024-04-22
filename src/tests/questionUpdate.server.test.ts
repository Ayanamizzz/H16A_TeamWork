
import { clear } from './other';
import { quizNewWithQuestion, reqQuestionUpdate, registerReq } from './api';

clear();
const quizNew = quizNewWithQuestion();

describe('PUT/v1/admin/quiz/{quizid}/question/{questionid}', () => {
  describe('Error Cases', () => {
    test('Quiz Id does not refer to a valid quiz', () => {
      const res = reqQuestionUpdate(123, 123, {}, quizNew.token);
      expect(res).toEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      const user2Token = registerReq('user2@gmail.com', 'Abc123456', 'User', 'Admin');
      const res = reqQuestionUpdate(quizNew.quizId, 123, {}, user2Token.token);
      expect(res).toEqual({ error: 'Quiz Id does not refer to a quiz that this user owns' });
    });

    test('Question Id does not refer to a valid question within this quiz', () => {
      const res = reqQuestionUpdate(quizNew.quizId, 123, {}, quizNew.token);
      expect(res).toEqual({ error: 'Question Id does not refer to a valid question within this quiz' });
    });

    test('Question string is less than 5 characters in length or greater than 50 characters in length', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'tttt',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'Question string is less than 5 characters in length or greater than 50 characters in length' });
    });

    test('Question string is less than 5 characters in length or greater than 50 characters in length', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'a'.repeat(51),
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'Question string is less than 5 characters in length or greater than 50 characters in length' });
    });

    test('The question has more than 6 answers or less than 2 answers', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The question has more than 6 answers or less than 2 answers' });
    });

    test('The question has more than 6 answers or less than 2 answers', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              },
              {
                answer: 'Extra answer 1',
                correct: false
              },
              {
                answer: 'extra answer 2',
                correct: false
              },
              {
                answer: 'extra answer 3',
                correct: true
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The question has more than 6 answers or less than 2 answers' });
    });

    test('The question duration is not a positive number', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: -1,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The question duration is not a positive number' });
    });

    test('If the question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 190,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'If the question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes' });
    });

    test('The points awarded for the question are less than 1 or greater than 10', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: -1,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The points awarded for the question are less than 1 or greater than 10' });
    });

    test('The points awarded for the question are less than 1 or greater than 10', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 12,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The points awarded for the question are less than 1 or greater than 10' });
    });

    test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: '',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long' });
    });

    test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe'.repeat(10),
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long' });
    });

    test('Any answer strings are duplicates of one another (within the same question)', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 4,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'maybe',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'Any answer strings are duplicates of one another (within the same question)' });
    });

    test('There are no correct answers', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: false
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toEqual({ error: 'There are no correct answers' });
    });

    test('Token is not a valid structure', () => {
      const res = reqQuestionUpdate(123, 123, {});
      expect(res).toEqual({ error: 'Token is not a valid structure' });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const res = reqQuestionUpdate(123, 123, {}, '123');
      expect(res).toEqual({ error: 'Provided token is a valid structure, but is not for a currently logged in session' });
    });

    test('Image is not png or jpg', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: '',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toStrictEqual({ error: 'imageUrl must return PNG or JPG' });
    });
  });

  describe('Success cases', () => {
    test('Correct return object', () => {
      const res = reqQuestionUpdate(
        quizNew.quizId,
        quizNew.questionId,
        {
          questionBody: {
            thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
            question: 'Am I going insane',
            duration: 4,
            points: 8,
            answers: [
              {
                answer: 'maybe',
                correct: true
              },
              {
                answer: 'no',
                correct: false
              },
              {
                answer: 'yes',
                correct: false
              },
              {
                answer: 'does it matter?',
                correct: false
              }
            ]
          }
        },
        quizNew.token
      );
      expect(res).toStrictEqual({});
    });
  });
});

afterAll(() => {
  clear();
});
