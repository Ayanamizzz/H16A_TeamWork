import { adminAuthRegister } from "./auth";
import { clear } from "./other.js";

const ERROR = { error: expect.any(String) };

describe("adminAuthRegister", () => {
    beforeEach(() => {
        clear();
    });

    //Email Register Test//
    test("Error: Email address is used by another user.", () => {
        //创建一个user
        adminAuthRegister(
            "sby1010284295@gmail.com",
            "wind4ever233",
            "Ma",
            "Jin",
        );

        expect(
            adminAuthRegister(
                "sby1010284295@gmail.com",
                "Alibaba233",
                "Zhu",
                "laoshi",

            )
        ).toStrictEqual(ERROR);
    });
    //when another people used this email

    //

    //check is that return id
    test("Successful registration of a new user", () => {
        const response = adminAuthRegister(
            "newuser@example.com",
            "StrongPassword123",
            "John",
            "Doe"
        );
        expect(response).toStrictEqual({authUserId: expect.any(Number)}); // 检查是否返回了authUserId属性
    });

    //email格式不对
    test("Error: Email does not satify.", () => {
        const response = adminAuthRegister(
            "invalidemail",
            "StrongPassword123",
            "John",
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //姓有非法字符
    test("Error: First name invalid", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "J$", // 非法字符
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //名有非法字符
    test("Error: Last name invalid", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "D@e" // 非法字符
        );
        expect(response).toStrictEqual(ERROR);
    });


    //姓太短
    test("Error: First name is less than 2 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "J", 
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //名太短
    test("Error: Last is less than 2 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "D"
        );
        expect(response).toStrictEqual(ERROR);
    });


    //姓太长
    test("Error: First name is more than 20 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "Joweajehffuoqohfwuhfqflkefkhqf",
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //名太长
    test("Error: Last name is more than 20 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "Dnriqrwiorhvnnrqlwrfkrqkqwrj"
        );
        expect(response).toStrictEqual(ERROR);
    });






    //密码太短
    test("Error: Password is less than 8 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "weak1", // 密码太短
            "John",
            "Doe"
        );
        expect(response).toMatchObject(ERROR);
    });

    //密码全是数字
    test("Error: Password does not contain at least one letter", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "123456789", 
            "John",
            "Doe"
        );
        expect(response).toMatchObject(ERROR);
    });

    test("Error: Password does not contain at least one number", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "abwivhjfjejo", 
            "John",
            "Doe"
        );
        expect(response).toMatchObject(ERROR);
    });

    test("Error: Password does not contain at least one number", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "&&#@*$(@)", 
            "John",
            "Doe"
        );
        expect(response).toMatchObject(ERROR);
    });



});

