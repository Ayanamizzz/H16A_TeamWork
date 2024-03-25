import config from './config.json';
import request from 'sync-request-curl';


const port = config.port;
const url = config.url;

const ERROR = { error: expect.any(String) };


describe("adminAuthRegister", () => {

    beforeEach(() => {
        request('DELETE', `${url}:${port}/v1/clear`, {});
    });

    //============================================================================
    //Email Register Test//
    test("Error: Email address is used by another user.", () => {
        //create a new user
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'z5437798@gmail.com',
                password: 'StrongPassword123',
                nameFirst: 'Ma',
                nameLast: 'Jin'
            },
        });
        //returnData存储response的内容的解析
        //并将其转换成.JSON格式存储
        let returnData = JSON.parse(response.body.toString());
        //当用户成功注册之后会返回一个独一无二的authUserId
        expect(returnData).toStrictEqual({
            token: expect.any(String),
        });

        response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'z5437798@gmail.com',
                password: 'StrongPassword123',
                nameFirst: 'Jin',
                nameLast: 'Ma'
            },
        });
        returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });


    //check is password letter or number

    test("check is password letter or number", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'linked@gmail.com',
                password: 'Linked123456',
                nameFirst: 'Jack',
                nameLast: 'Wang',
            },
        });
        
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual({
            authUserId: expect.any(Number),
        });
    });

    //email format is not right
    test("Error: Email does not satify.", () => {
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'invalidemail',
                password: 'StrongPassword123',
                nameFirst: 'Ma',
                nameLast: 'Jin'
            },
        });

        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });

    //if firstname contains illegal characters
    test("Error: First name invalid", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'J$',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });

    // if lastname contains illegal characters
    test("Error: Last name invalid", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'John',
                nameLast: 'D@e'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });



    //first name is too short
    test("Error: First name is less than 2 characters", () => {
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'J',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });

    //last name is too short
    test("Error: Last is less than 2 characters", () => {
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'John',
                nameLast: 'D'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);


    });


    //fitst name is too long
    test("Error: First name is more than 20 characters", () => {
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'Joweajehffuoqohfwuhfqflkefkhq1oer2okr2kj',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });

    //last name is too long
    test("Error: Last name is more than 20 characters", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'StrongPassword123',
                nameFirst: 'John',
                nameLast: 'Dnriqrwiorhvnnrqlwrfkrqkqwrj1o'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);

    });



    //password is too weak
    test("Error: Password is less than 8 characters", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'weak1',  // password is too short..
                nameFirst: 'John',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);
    });

    //password is all num
    test("Error: Password does not contain at least one letter", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: '123456789',  // password is too short..
                nameFirst: 'John',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);

    });

    test("Error: Password does not contain at least one number", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: 'abwivhjfjejo',  // password is too short..
                nameFirst: 'John',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);

    });

    test("Error: Password does not contain at least one number", () => {

        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'johndoe@example.com',
                password: '&&#@*$(@)',  // password is too short..
                nameFirst: 'John',
                nameLast: 'Doe'
            },
        });
        const returnData = JSON.parse(response.body.toString());
        expect(returnData).toStrictEqual(ERROR);

    });

    test("Error: Email address is used by another user.", () => {
    //create a new user
        let response = request('POST', `${url}:${port}/v1/admin/auth/register`, {
            json: {
                email: 'z5437798@gmail.com',
                password: 'StrongPassword123',
                nameFirst: 'Ma',
                nameLast: 'Jin'
            },
        });
        //returnData存储response的内容的解析
        //并将其转换成.JSON格式存储
        let returnData = JSON.parse(response.body.toString());
        //当用户成功注册之后会返回一个独一无二的authUserId
        expect(returnData).toStrictEqual({
            token: expect.any(String),
        });

    });



});


