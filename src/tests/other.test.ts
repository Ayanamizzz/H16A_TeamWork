import { clear } from './other';
import { getData, setData } from './../dataStore';

describe('testing clear function', () => {
  test('Returns an empty object', () => {
    expect(clear()).toStrictEqual({});
  });

  test('Clears data', () => {
    const store = getData();

    const numbers:number[] = [1, 2, 3, 5, 6];
    const courseCodes:string[] = ['1511', '3541', '1140'];

    (store as any).numbers = numbers;
    (store as any).courseCodes = courseCodes;

    setData(store);
    clear();

    expect(getData()).toStrictEqual({
      users: [],
      quizzes: [],
      tokens: [],
      trash: [],
      quizSessions: []
    });
  });

  test('Clears if data even if data is empty', () => {
    const newDataObject = {};
    setData(newDataObject);
    clear();
    expect(getData()).toStrictEqual({
      users: [],
      quizzes: [],
      tokens: [],
      trash: [],
      quizSessions: []
    });
  });
});

afterAll(() => {
  clear();
});
