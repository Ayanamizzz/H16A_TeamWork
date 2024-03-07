import { adminAuthLogin, adminAuthRegister } from "./auth";

import { clear } from "./other.js";

const ERROR = { error: expect.any(String) };

describe("adminAuthLogin", () => {
    // everytime clear
    beforeEach(() => {
        //Clear data store when i do test;
        clear();
    });

    test("Error: Email does not exist.", () => {
        //report any error
        expect(adminAuthLogin("sby1010284295@gmail.com", "qwek1023")).toEqual(
            ERROR
        );
    });

    test("Error: Password is incorrect.", () => {
        adminAuthRegister(
            "sby1010284295@gmail.com",
            "wind4ever233qwq",
            "Ma",
            "Jin"
        );

        expect(adminAuthLogin("sby1010284295@gmail.com", "iloveosu123")).toEqual(
            //report any error
            ERROR
        );
    });


});

describe("Successful check", () => {
    // successful to check Password
    test("Success: Password is correct.", () => {
        adminAuthRegister(
            "sby1010284295@gmail.com",
            "wind4ever233qwq",
            "Ma",
            "Jin"
        );

        expect(adminAuthLogin("sby1010284295@gmail.com", "wind4ever233qwq")).toEqual({ authUserId: expect.any(Number) });
    });


})