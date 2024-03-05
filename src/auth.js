// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//从dataStore.js里提取function来获得数据
import { getData, setData } from './dataStore.js';

//从npmjs.com/package/validator调用isEmail
import isEmail from 'validator/lib/isEmail';


// Description:
// Given a registered user's email and password returns their authUserId value.

function adminAuthLogin(email, password) {
    //接入数据 从数据库里提取data
    let data = getData();
    //判断邮箱是否重复
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].email === email) {
            if (data.users[i].password === password) {
                return {
                    authUserId: data.users[i].authUserId
                }
            } else {
                return { 
                    error: 'Password is not correct for the given email.' 
                };
            }
        }
    }
    
    return {
        error: 'Email address does not exist.'
    }
}




export { adminAuthLogin };



