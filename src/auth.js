// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

//从dataStore.js里提取function来获得数据
import { getData, setData } from './dataStore.js';

//从npmjs.com/package/validator调用isEmail
import isEmail from 'validator/lib/isEmail';

/*
 * @params {string} email
 * @params {string} password
 * @params {string} nameFirst
 * $params {string} nameLast
 * @returns {quizId} Id of quiz
 * 
 * 
*/

function adminAuthRegister(email, password, nameFirst, nameLast) {
    //提取数据到data
    let data = getData();
    //If allow_display_name is set to true, the validator will also match Display Name <email-address>. 
    //If require_display_name is set to true, the validator will reject strings without the format Display Name <email-address>. 
    //If allow_utf8_local_part is set to false, the validator will not allow any non-English UTF8 character in email address' local part. 
    //If require_tld is set to false, email addresses without a TLD in their domain will also be matched. 
    //If ignore_max_length is set to true, the validator will not check for the standard max length of an email. 
    //If allow_ip_domain is set to true, the validator will allow IP addresses in the host part. 
    //If domain_specific_validation is true, some additional validation will be enabled, 
    //e.g. disallowing certain syntactically valid email addresses that are rejected by Gmail. 
    //If blacklisted_chars receives a string, then the validator will reject emails that include any of the characters in the string, in the name part. 
    //If host_blacklist is set to an array of strings and the part of the email after the @ symbol matches one of the strings defined in it, the validation fails. 
    //If host_whitelist is set to an array of strings and the part of the email after the @ symbol matches none of the strings defined in it, the validation fails.
    const options = { allow_display_name: false, 
        require_display_name: false, 
        allow_utf8_local_part: true, 
        require_tld: true, 
        allow_ip_domain: false, 
        allow_underscores: false, 
        domain_specific_validation: false, 
        blacklisted_chars: '', 
        host_blacklist: [] 
    }
    
    //查询所有user的email 是否是 查询 email
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].email === email) {
            return {
                error: 'Email address is used by another user.'
            }
        }
    }
    //调用网站的isEmail function来判断是不是邮箱
    if (isEmail(email, options) === false) {
        return {
            error: 'Email does not satisfy',
        }
    };

    for (let i = 0; i < nameFirst.length; i++) {
        //charCodeAt 可以得到unicode
        let letter = nameFirst.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameFirst is not vaildNameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    }

    for (let i = 0; i < nameLast.length; i++) {
        //charCodeAt 可以得到unicode
        let letter = nameLast.charCodeAt(i);
        if (letter > 122 || (letter < 65 && letter !=32 && letter != 45 && letter != 39)) {
            return {
                error: 'nameLast is not vaildNameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'
            }
        } 
    }


    if (nameFirst.length < 2 || nameFirst.length > 20) {
        return {
            error: 'NameFirst is less than 2 characters or more than 20 characters.',
        }
    }

    if (nameLast.length < 2 || nameLast.length > 20) {
        return {
            error: 'NameLast is less than 2 characters or more than 20 characters.',
        }
    }

    
    if (password.length < 8) {
        return {
            error: 'Password is less than 8 characters.',
        }
    }

    let isLetter = 0;
    let isNumber = 0;

    for (let i = 0; i < password.lengthl; i++) {
        const letter = password.charCodeAt(i);
        //A - Z的ascii的范围是65-90
        //a - z的ascii的范围是97-122
        if ((letter >= 65 && letter <= 90) || (letter >= 97 && letter <= 122)) {
            isLetter = 1;
        } else if (letter >= 48 && letter <= 57) {
            isNumber = 1;
        }
    }

    if (isLetter === 0 || isNumber === 0) {
        return {
            error: 'Password does not contain at least one number and at least one letter.'
        }
    }

    let new_id = 1;
    const find_ids = dataStore.users.map((user) => user.userId);
    //用has查找现在Id
    //即便是用户删除了 导致id出现中断可以产生唯一id
    //每次循环查找数组确保id是否存在
    //has -> include
    while (find_ids.has(new_id)) {
        new_id++;
    }

    data.users.push({
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
        authUserId: new_id,
    })
    //用set来存储现在有的用户id 
    setData(data);

    const id = {
        authUserId: new_id,
    }
    return id;
}



export { adminAuthRegister };



