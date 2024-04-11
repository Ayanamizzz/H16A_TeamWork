import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

interface Answer {
    answer: string;
    correct: boolean;
}

interface QuestionBody {
    question: string;
    duration: number;
    points: number;
    answers: Answer[];
}

interface QuestionData {
    token: string;
    questionBody: QuestionBody;
}

const newUser = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast };
};

const createQuiz = (name: string, description: string, token : string) => {
  return { name: name, description: description, token };
};

const requestRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  const res = request('POST', `${url}:${port}/v1/admin/auth/register`, { json: newUser(email, password, nameFirst, nameLast) });
  return JSON.parse(res.body.toString());
};

const requestNewQuiz = (name: string, description: string, tokens?: string) => {
  const res = request('POST', `${url}:${port}/v1/admin/quiz`, { json: createQuiz(name, description, tokens) });
  return JSON.parse(res.body.toString());
};

const requestNewQuestion = (quizId: number, data:QuestionData) => {
  const res = request('POST', `${url}:${port}/v1/admin/quiz/${quizId}/question`, { json: data });
  return JSON.parse(res.body.toString());
};

// Clear the database before each test

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
    let user1Token = '';
    let user1Quiz1 = 0;
    beforeEach(() => {
      request('DELETE', `${url}:${port}/v1/clear`, {});

      user1Token = requestRegister('user@gmail.com', 'Abc123456', 'User', 'Admin').token;
      user1Quiz1 = requestNewQuiz('quiz1', 'description', user1Token).quizId;
    });

    test('Quiz Id does not refer to a valid quiz', () => {
      const response = requestNewQuestion(
        user1Quiz1 - 1000,
        {
          token: user1Token,
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
        }

      );
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      requestRegister('hello@gmail.com', 'Abc123456', 'FirstName', 'LastName');
      requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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

        }

      );
      // expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('Question string is less than 5 characters in length or is greater than 50 characters in length', () => {
      const response1 = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response1).toStrictEqual({ error: expect.any(String) });
    });

    test('The question has more than 6 answers or less than 2 answers', () => {
      const response1 = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response1).toStrictEqual({ error: expect.any(String) });
    });

    test('The question duration is not a positive number', () => {
      const response = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
      const response = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('The points awarded for the question are less than 1 or are greater than 10', () => {
      const response1 = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
          questionBody: {

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
        }

      );
      expect(response1).toStrictEqual({ error: expect.any(String) });
    });

    test('The length of any answer is shorter than 1 character long, or longer than 30 characters long', () => {
      const response1 = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response1).toStrictEqual({ error: expect.any(String) });
    });

    test('One or more answer strings are duplicates', () => {
      const response = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('There are no correct answers', () => {
      const response = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('Token is not a valid structure', () => {
      const response = requestNewQuestion(
        1,
        {
          token: 'xxxx',
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
      expect(response).toStrictEqual({ error: expect.any(String) });
    });

    test('Provided token is a valid structure, but is not for a currently logged in session', () => {
      const response = requestNewQuestion(
        1,
        {
          token: 'xxxxxxxxxx',
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
      expect(response).toStrictEqual({ error: expect.any(String) });
    });
  });

  describe('Success Cases', () => {
    let user1Token = '';
    let user1Quiz1 = 0;
    beforeEach(() => {
      request('DELETE', `${url}:${port}/v1/clear`, {});

      user1Token = requestRegister('user@gmail.com', 'Abc123456', 'User', 'Admin').token;
      user1Quiz1 = requestNewQuiz('quiz1', 'description', user1Token).quizId;
    });
    test('Returns questionId and sets answer to random colour', () => {
      const response = requestNewQuestion(
        user1Quiz1,
        {
          token: user1Token,
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
        }

      );
      // expect(response.statusCode).toEqual(200);

      // console.log(response);
      expect(response).toStrictEqual({ questionId: expect.any(Number) });
    });
  });
});

afterAll(() => {
  request('DELETE', `${url}:${port}/v1/clear`, {});
});
