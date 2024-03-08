// Description:
// Reset the state of the application back to the start.

import { getData, setData } from "./dataStore.js";


export function clear() {
    let data = getData();
    data.users = [];
    data.quizzes = [];
    
    setData(data);
    return {};
}

  