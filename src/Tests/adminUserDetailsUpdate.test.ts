import config from '../config.json';
import request from 'sync-request-curl';

const port = config.port;
const url = config.url;


beforeEach(() => {
    request('DELETE', `${url}:${port}/v1/clear`, {});

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


describe("Test successful adminUserDetailsUpdate", () => {
    test("Test successful case", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harley',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2).toStrictEqual({});
    });
});


describe("Test invalid input of adminUserDetailsUpdate", () => {
    test("AuthUserId is not a valid user", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId + 1,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harley',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("Email is currently used by another user.", () => {
        const res2 = request(
            'POST',
                `${url}:${port}/v1/admin/auth/register`,
                {
                qs: {
                    email: 'auhdia@gmail.com',
                    password: 'hiahuL123456',
                    nameFirst: 'Leo',
                    nameLast: 'Yang'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );

        const res3 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Wade',
                    nameLast: 'Alfred'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj3 = JSON.parse(res3.body as string);
        expect(bodyObj3.error).toStrictEqual(expect.any(String));
    });

    test("Email does not satisfy.", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'invalidemail',
                    nameFirst: 'Harley',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or aposrtrophes.", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harle*%',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or aposrtrophes.", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harley',
                    nameLast: 'Le@%%'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameFirst is less than 2 characters", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'H',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameFirst is more than 20 characters", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'HarleyIhiwhdifkhwnikwljowifh',
                    nameLast: 'Lew'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameLast is less than 2 characters", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harley',
                    nameLast: 'L'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });

    test("NameLast is more than 20 characters", () => {
        const res2 = request(
            'PUT',
                `${url}:${port}/v1/admin/auth/details`,
                {
                qs: {
                    token: bodyObj1.userId,
                    email: 'auhdia@gmail.com',
                    nameFirst: 'Harley',
                    nameLast: 'Woeajbhiebuqjfhniksnid'    
                },
                // adding a timeout will help you spot when your server hangs
                //   timeout: 100
                }
        );
        const bodyObj2 = JSON.parse(res2.body as string);
        expect(bodyObj2.error).toStrictEqual(expect.any(String));
    });
});