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

describe('Test invalid input of adminQuizCreate', () => {
    test('Test invalid authUserId', () => {
        // AuthUserId is not a valid user.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId + 1,
                    name: 'Quiz1',
                    description: 'The first quiz'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        // Name contains invalid characters（Valid characters are alphanumeric and spaces.）
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: 'Qu!z@@',
                    description: 'The first quiz'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        // Name is either less than 3 characters long or more than 30 characters long.
        // This test will check name is less than 3 characters long.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: 'Q',
                    description: 'The first quiz'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        // Name is either less than 3 characters long or more than 30 characters long.
        // This test will check name is more than 30 characters long.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: 'Quiz for COMP1531 Group project Team Dream',
                    description: 'The first quiz'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        // Name is already used by the current logged in user for another quiz.
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: 'Quiz1',
                    description: 'The first quiz'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );

        const res3 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                    qs: {
                    token: bodyObj1.authUserId,
                    name: 'Quiz1',
                    description: 'The second quiz'
                    },
                    // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res3.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid description', () => {
        // Description is more than 100 characters in length (note: empty strings are OK).
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/quiz`,
                {
                qs: {
                    token: bodyObj1.authUserId,
                    name: 'Quiz1',
                    description: 'The first quiz that used for group project iteration 1 of course COMP1531 Software Engineering Fundamentals'
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizCreate', () => {
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
        expect(bodyObj2.quizId).toStrictEqual({ "quizId": expect.any(Number) });
    });
});
