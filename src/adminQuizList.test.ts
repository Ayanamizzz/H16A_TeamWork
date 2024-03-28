import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;

beforeEach(() => {
    // Reset before test.
    request('DELETE', `${url}:${port}/v1/clear`, {});
    // Create quiz that return quizId if no error
    const res1 = request(
        'POST',
                `${url}:${port}/v1/admin/auth/register`,
                {
                qs: {
                    email: 'linked@gmail.com',
                    password: 'linked123456',
                    nameFirst: 'Jack',
                    nameLast: 'Wang'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
    const bodyObj1 = JSON.parse(res1.body as string);
});


describe('Test invalid input of adminQuizList', () => {
    test('Test invalid authUserId', () => {
        // AuthUserId is not a valid user.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: "Quiz1",
                    description: "The first quiz"
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);

        const res3 = request(
            'GET',
                `${url}:${port}/v1/admin/quiz/list`,
                {
                    qs: {
                        token: bodyObj1.authUserId + 1,
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizList', () => {
   test('Test successful case', () => {
        // Reset before test.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: "Quiz1",
                    description: "The first quiz"
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);

        const res3 = request(
            'GET',
                `${url}:${port}/v1/admin/quiz/list`,
                {
                    qs: {
                        token: bodyObj1.authUserId,
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3.quizzes).toStrictEqual({ 
            "quizzes": [
                {
                "quizId": bodyObj2.quizId,
                "name": 'Quiz1'
                }
            ]
        });
   });
});
