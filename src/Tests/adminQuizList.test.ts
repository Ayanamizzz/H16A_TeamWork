import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;


describe('Test invalid input of adminQuizList', () => {
    test('Test invalid token', () => {
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
        expect(res1.statusCode).toStrictEqual(200);
        const bodyObj1 = JSON.parse(res1.body.toString());
        expect(bodyObj1).toStrictEqual({ token: expect.any(String) });

        const res2 = request('POST', `${url}:${port}/v1/admin/quiz`, {
            json: {
                token: bodyObj1.token,
                name: 'Quiz1',
                description: 'The first quiz'
            },
        });
        expect(res2.statusCode).toStrictEqual(200);
        const bodyObj2 = JSON.parse(res2.body.toString());
        expect(bodyObj2).toStrictEqual({ quizId: expect.any(Number) });

        const res3 = request('GET', `${url}:${port}/v1/admin/quiz/list`, {
            json: {
                token: bodyObj1.token,
            },
        });
        expect(res3.statusCode).toStrictEqual(401);
        const bodyObj3 = JSON.parse(res3.body.toString());
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });
});


describe('Test successful adminQuizList', () => {
    beforeEach(() => {
        request('DELETE', `${url}:${port}/v1/clear`, {});
    });

   test('Test successful case', () => {
        const res = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang'    
            },
        });
        const token = JSON.parse(res.body.toString()).token;
        const res1 = request('GET', `${url}:${port}/v1/admin/quiz/list`, {
            qs: {
                token: token,
            },

        });

        expect(res.statusCode).toStrictEqual(200);
        const returnData = JSON.parse(res1.body.toString());
        expect(returnData).toStrictEqual({ quizzes: expect.any(Array) });
   });
});
