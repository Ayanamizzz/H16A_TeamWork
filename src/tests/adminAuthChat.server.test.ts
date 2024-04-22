import { clear } from './other';
import {
  getChat,
  reqNewQuestion,
  reqNewQuiz,
  reqNewSession,
  reqPlayerJoin, registerReq,
  sendChat
} from './api';

clear();

// Objects for testing
const user = registerReq('hello@gmail.com', 'ThePStandsforPassword1', 'Josh', 'Cool');
const quiz = reqNewQuiz('This is the name of the quiz', 'This quiz is so that we can have a lot of fun', user.token);
reqNewQuestion(
  quiz.quizId,
  {
    questionBody: {
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: 'Bob from wellington',
          correct: false
        }
      ],
      thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
    }
  },
  user.token
);
const session = reqNewSession(quiz.quizId, 10, user.token);
const player1 = reqPlayerJoin(session.sessionId, 'Josh');
const player2 = reqPlayerJoin(session.sessionId, 'Hayden');

/*
Tests for POST/v1/player/{playerid}/chat
Error Cases:
  - PlayerId doesnt exist
  - Message body is less than 1 character or more than 100 characters

Success Cases:
  - Correct Return Object
  - NOTE: Correct additions to dataStore are testing in the GET chat function
*NOTE: error messages will only show one error at a time with priority given
from the above list
*/
describe('POST/v1/player/{playerid}/chat', () => {
  describe('error cases', () => {
    test('PlayerId does not exist', () => {
      expect(sendChat(player2.playerId + 100, 'hello')).toStrictEqual({ error: 'PlayerId does not exist' });
    });

    test('Message body is less than 1 character or more than 100 characters', () => {
      expect(sendChat(player1.playerId, '')).toStrictEqual({ error: 'Message body is less than 1 character or more than 100 characters' });
      expect(sendChat(player1.playerId, 'a'.repeat(110))).toStrictEqual({ error: 'Message body is less than 1 character or more than 100 characters' });
    });
  });

  describe('success cases', () => {
    test('Correct return object', () => {
      expect(sendChat(player1.playerId, 'hello')).toStrictEqual({});
    });
  });
});

/*
Tests for GET/v1/player/{playerid}/chat
Error Cases:
  - Player Id doesnt exist

Success Cases:
  - Correctly returns chat

*NOTE: error messages will only show one error at a time with priority given
from the above list
*/
describe('POST/v1/player/{playerid}/chat', () => {
  describe('error cases', () => {
    test('PlayerId does not exist', () => {
      expect(getChat(player2.playerId + 100)).toStrictEqual({ error: 'PlayerId does not exist' });
    });
  });

  describe('success cases', () => {
    test('Gives chat', () => {
      sendChat(player2.playerId, 'hey buddy');
      sendChat(player1.playerId, 'This is an aweful lot like kahoot aye?');
      expect(getChat(player2.playerId)).toStrictEqual({
        messages: [
          {
            messageBody: 'hello',
            playerId: player1.playerId,
            playerName: 'Josh',
            timeSent: expect.any(Number),
          },
          {
            messageBody: 'hey buddy',
            playerId: player2.playerId,
            playerName: 'Hayden',
            timeSent: expect.any(Number),
          },
          {
            messageBody: 'This is an aweful lot like kahoot aye?',
            playerId: player1.playerId,
            playerName: 'Josh',
            timeSent: expect.any(Number),
          }
        ]
      });
    });
  });
});

afterAll(() => {
  clear();
});
