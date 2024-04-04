import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;


describe('Test invalid input of adminQuizRemove', () => {
    beforeEach(() => {
        // Reset before test.
        request('DELETE', `${url}:${port}/v1/clear`, {});
    });

    test('Test invalid userId', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
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
        const bodyObj2 = JSON.parse(res2.body.toString());
 
        const res3 = request(
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    json: {                    
                    quizId: bodyObj2.quizId,
                    token: bodyObj1.token + 1
                    },

                }
        );
        expect(res3.statusCode).toStrictEqual(401);
        const bodyObj3 = JSON.parse(res3.body.toString());
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid quizId', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const token = JSON.parse(res1.body.toString()).token;

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
            token: token,
            name: "Quiz1",
            description: "The first quiz"
            },
        });
        const quizId = JSON.parse(res2.body.toString()).quizId;
    
        const res3 = request(
            'DELETE',
                `${url}:${port}/v1/admin/quiz/{quizId}`,
                {
                    json: {                    
                    quizId: quizId + 1,
                    token: token,
                    },

                }
        );
        expect(res3.statusCode).toStrictEqual(403);
        const bodyObj3 = JSON.parse(res3.body.toString());
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });

    test('Test invalid quizId', () => {
        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const token1 = JSON.parse(res1.body.toString()).token;

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: token1,
                name: "Quiz1",
                description: "The first quiz"
            },
        });
        const quizId1 = JSON.parse(res2.body.toString()).quizId1;

        // Create another quiz.
        const res3 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'majin666@gmail.com',
                password: 'Linked12256',
                nameFirst: 'Ma',
                nameLast: 'Jin'    
            },

        });
        const token2 = JSON.parse(res3.body.toString()).token;

        const res4 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: token2,
                name: "Quiz2",
                description: "The second quiz"
            },
        });
        const quizId2 = JSON.parse(res4.body.toString()).quizId;

        const res5 = request('DELETE', `${url}:${port}/v1/admin/quiz/{quizId}`, {
            json: {                    
                quizId: quizId1,
                token: token2,
            },
        });
        expect(res4.statusCode).toStrictEqual(403);
        const bodyObj5 = JSON.parse(res5.body.toString());
        expect(bodyObj5.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizRmove', () => {
    test('Test successful case', () => {
        // Reset before test.
        request('DELETE', `${url}:${port}/v1/clear`, {});

        const res1 = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const token = JSON.parse(res1.body.toString()).token;

        const res2 = request('POST',  `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: token,
                name: "Quiz1",
                description: "The first quiz"
            },
        });
        const quizId = JSON.parse(res2.body.toString()).quizId;
    
        const res3 = request('DELETE', `${url}:${port}/v1/admin/quiz/{quizId}`, {
            json: {                    
                quizId: quizId,
                token: token,
            },
        });

        expect(res3.statusCode).toStrictEqual(200);
        const result = JSON.parse(res3.body.toString());
        expect(result).toStrictEqual({});
    });
});
