import { adminAuthRegister } from "./auth";
import { clear } from "./other.js";

const ERROR = { error: expect.any(String) };

describe("adminAuthRegister", () => {

    //Email Register Test//
    test("Error: Email address is used by another user.", () => {
        //create a new user
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


    //check is that return id
    test("Successful registration of a new user", () => {
        const response = adminAuthRegister(
            "newuser@example.com",
            "StrongPassword123",
            "John",
            "Doe"
        );
        expect(response).toStrictEqual({authUserId: expect.any(Number)}); // Check if authUserId attribute is returned
    });

    //check is password letter or number

    test("check is password letter or number", () => {
        const response = adminAuthRegister(
            "linked@gmail.com",
            "Linked123456",
            "Jack",
            "Wang"
        );
        expect(response).toStrictEqual({authUserId: expect.any(Number)});
    });

    //email format is not right
    test("Error: Email does not satify.", () => {
        const response = adminAuthRegister(
            "invalidemail",
            "StrongPassword123",
            "John",
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //if firstname contains illegal characters
    test("Error: First name invalid", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "J$", // illegal characters
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    // if lastname contains illegal characters
    test("Error: Last name invalid", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "D@e" // illegal characters
        );
        expect(response).toStrictEqual(ERROR);
    });


    //first name is too short
    test("Error: First name is less than 2 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "J", 
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //last name is too short
    test("Error: Last is less than 2 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "D"
        );
        expect(response).toStrictEqual(ERROR);
    });


    //fitst name is too long
    test("Error: First name is more than 20 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "Joweajehffuoqohfwuhfqflkefkhqf",
            "Doe"
        );
        expect(response).toStrictEqual(ERROR);
    });

    //last name is too long
    test("Error: Last name is more than 20 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "StrongPassword123",
            "John",
            "Dnriqrwiorhvnnrqlwrfkrqkqwrj"
        );
        expect(response).toStrictEqual(ERROR);
    });



    //password is too weak
    test("Error: Password is less than 8 characters", () => {
        const response = adminAuthRegister(
            "johndoe@example.com",
            "weak1", // password is too short..
            "John",
            "Doe"
        );
        expect(response).toMatchObject(ERROR);
    });

    //password is all num
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

