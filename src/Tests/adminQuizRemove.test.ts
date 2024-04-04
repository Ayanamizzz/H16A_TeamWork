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


describe('Test invalid input of adminQuizRemove', () => {
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
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    qs: {                    
                    quizId: bodyObj2.quizId,
                    token: bodyObj1.authUserId + 1
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid quizId', () => {
        // Quiz ID does not refer to a valid quiz.
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
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    qs: {                    
                    quizId: bodyObj2.quizId + 1,
                    token: bodyObj1.authUserId
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid quizId', () => {
        // Quiz ID does not refer to a quiz that this user owns.
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

        // Create another quiz.
        const res3 = request(
            'POST',
                `${url}:${port}/v1/admin/auth/register`,
                {
                    qs: {
                    email: 'majin666@gmail.com',
                    password: 'Linked12256',
                    nameFirst: 'Ma',
                    nameLast: 'Jin'    
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
    
        const res4 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                    qs: {
                    token: bodyObj1.authUserId,
                    name: "Quiz2",
                    description: "The second quiz"
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj4 = JSON.parse(res4.body as string);

        const res5 = request(
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    qs: {                    
                    quizId: bodyObj2.quizId,
                    token: bodyObj3.authUserId
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj5 = JSON.parse(res5.body as string);
        expect(bodyObj5.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizRmove', () => {
    test('Test successful case', () => {
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
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    qs: {                    
                    quizId: bodyObj2.quizId,
                    token: bodyObj1.authUserId
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3).toStrictEqual({});
    });
});
