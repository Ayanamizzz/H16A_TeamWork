import { getData, setData } from './dataStore.js';
import { clear } from './other.js';

describe("clear function", () => {

    beforeEach(() => {
        setData({
            users:[{userid: 1, name: "majin"}],
            quizzes:[{quizzesid: 1, name: "quiz 1"}]
        });
    });

    test("Should reset the application state back to the start", () => {

        let data = getData();

        expect(data.users.length).toBeGreaterThan(0);
        expect(data.quizzes.length).toBeGreaterThan(0);

        clear();

        data = getData();
        expect(data.users).toEqual([]);
        expect(data.quizzes).toEqual([]);
    });



})