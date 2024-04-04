import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;


describe('Test invalid input of adminQuizCreate', () => {
    beforeEach(() => {
        // Reset before test.
        request('DELETE', `${url}:${port}/v1/clear`, {});
    });

    test.each([
        // Test invalid token
        { token: 9999 },
        { token: 12 },
        { token: 'me' },
        { token: '!2das@@3' },
    ])("invalid user ID : '$invalidID'", ({ token }) => {
        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`,  {
            json: {
            token: token,
            name: 'Quiz1',
            description: 'The first quiz'
            },
        });
        expect(res2.statusCode).toStrictEqual(401);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    // test('Test invalid userId', () => {
    //     const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
    //         json: {
    //             email: 'linked@gmail.com',
    //             password: 'Linked123456',
    //             nameFirst: 'Jack',
    //             nameLast: 'Wang'    
    //         },
    //     });
    //     expect(res1.statusCode).toStrictEqual(200);
    //     const bodyObj1 = JSON.parse(res1.body.toString());
    //     expect(bodyObj1).toStrictEqual({ token: expect.any(String) });

    //     const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
    //         json: {
    //             token: bodyObj1.token + 1,
    //             name: 'Quiz1',
    //             description: 'The first quiz'
    //         },
    //     });
    //     expect(res2.statusCode).toStrictEqual(401);
    //     const bodyObj2 = JSON.parse(res2.body.toString());
    //     expect(bodyObj2.error).toStrictEqual(expect.any(String));
    // });

    test('Test invalid name', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Qu!z@@',
                description: 'The first quiz'
            },
        });
        expect(res2.statusCode).toStrictEqual(400);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Q',
                description: 'The first quiz'
            },
        });
        expect(res2.statusCode).toStrictEqual(400);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Quiz for COMP1531 Group project Team Dream',
                description: 'The first quiz'
            },

        });
        expect(res2.statusCode).toStrictEqual(400);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid name', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Quiz1',
                description: 'The first quiz'
            },
        });

        const res3 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Quiz1',
                description: 'The second quiz'
            },
        });
        expect(res3.statusCode).toStrictEqual(400);
        const bodyObj2 = JSON.parse(res3.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid description', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Quiz1',
                description: 'The first quiz that used for group project iteration 1 of course COMP1531 Software Engineering Fundamentals'
            },
        });
        expect(res2.statusCode).toStrictEqual(400);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizCreate', () => {
    test('Test successful case', () => {
        // Reset before test.
        request('DELETE', `${url}:${port}/v1/clear`, {});

        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'Linked@gmail.com',
                password: 'linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const bodyObj1 = JSON.parse(res1.body.toString());

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: "Quiz1",
                description: "The first quiz"
            },
        });

        expect(res2.statusCode).toStrictEqual(200);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2).toStrictEqual({ quizId: expect.any(Number) });
    });
});
