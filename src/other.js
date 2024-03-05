// Description:
// Reset the state of the application back to the start.
import { getData, setData } from "./dataStore.js";


export function clear() {
    let data = getData();
    data.users = [];
    //添加更多数据库里的内容
    //data.quizzes = [];
    
    setData(data);
    return {};
}
  
