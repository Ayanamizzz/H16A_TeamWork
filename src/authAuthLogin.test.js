import { adminAuthLogin, adminAuthRegister } from "./auth";

import { clear } from "./other.js";

const ERROR = { error: expect.any(String) };

describe("adminAuthLogin", () => {
    // 这个clear如果有bug就删掉
    // beforeEach(() => {
    //     //Clear data store when i do test;
    //     clear();
    // });

    
    test("Error: Email does not exist.", () => {

        expect(adminAuthLogin("sby1010284295@gmail.com", "qwek1023")).toEqual(
            //report any error
            ERROR
        );
    });

    test("Error: Passwordis incorrect.", () => {
        adminAuthRegister(
            "sby1010284295@gmail.com",
            "wind4ever233qwq",
            "Ma",
            "Jin"
        );

        expect(adminAuthLogin("sby1010284295@gmail.com", "amiluosu123")).toEqual(
            //report any error
            ERROR
        );
    });


});