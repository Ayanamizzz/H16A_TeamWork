import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const bodyStringToObj = (res: any) => JSON.parse(res.body.toString());

const postRequest = (url: string, data: any, header?: any) => {
  const res = request('POST', url, { json: data, headers: header });
  return bodyStringToObj(res);
};

const newUser = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast };
};

const createQuiz = (name: string, description: string) => {
  return { name: name, description: description };
};


const requestRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return postRequest(`${url}:${port}/v1/admin/auth/register`, newUser(email, password, nameFirst, nameLast));
};

const requestNewQuiz = (name: string, description: string, tokens?: string) => {
  return postRequest(`${url}:${port}/v1/admin/quiz`, createQuiz(name, description), { token: tokens });
};

const requestNewQuestion = (quizId: number, data: any, tokens?: any) => {
  return postRequest(`${url}:${port}/v1/admin/quiz/${quizId}/question`, data, { token: tokens });
};


// Clear the database before each test
beforeEach(() => {
  request('DELETE', `${url}:${port}/v1/clear`, {});
});

const user1Token = requestRegister('user@gmail.com', 'Abc123456', 'User', 'Admin');
const user1Quiz1 = requestNewQuiz('quiz1', 'description', user1Token.token);


/*
Tests for /v1/admin/quiz/{quizid}/question
This function Create a new stub question for a particular quiz.
When this route is called, and a question is created, the timeLastEdited is set as the same as the created time,
and the colours of all answers of that question are randomly generated.
Success Cases:
  - This function create Correct object
  - This function has transfers quiz to user with quizzes
Error Cases:
  Question string is less than 5 characters in length or greater than 50 characters in length
  The question has more than 6 answers or less than 2 answers
  The question duration is not a positive number
  The sum of the question durations in the quiz exceeds 3 minutes
  The points awarded for the question are less than 1 or greater than 10
  The length of any answer is shorter than 1 character long, or longer than 30 characters long
  Any answer strings are duplicates of one another (within the same question)
  There are no correct answers
*/

describe('POST/v1/admin/quiz/{quizid}/question', () => {
  describe('Error Cases', () => {
    test('Quiz Id does not refer to a valid quiz', () => {
      const response = requestNewQuestion(
        user1Quiz1.quizId - 1000,
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
        user1Token.token
      );
      expect(response).toStrictEqual({ error: 'Quiz Id does not refer to a valid quiz' });
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      const user2Token = requestRegister('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
      const response = requestNewQuestion(
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
      const response1 = requestNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
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
      const response1 = requestNewQuestion(
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
      const response = requestNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
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
      const response = requestNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
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
      const response1 = requestNewQuestion(
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
      const response1 = requestNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
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
      const response = requestNewQuestion(
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
      const response = requestNewQuestion(
        user1Quiz1.quizId,
        {
          questionBody: {
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
      const response = requestNewQuestion(
        1,
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
      const response = requestNewQuestion(
        1,
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
      const response = requestNewQuestion(
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
      const response = requestNewQuestion(
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
        user1Token.token
      );
      expect(response).toStrictEqual({ questionId: expect.any(Number) });
    });
  });
});

afterAll(() => {
  request('DELETE', `${url}:${port}/v1/clear`, {});
});

