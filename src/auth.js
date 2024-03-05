// Description: 
// Register a user with an email, password, and names, then returns their 
// authUserId value.

function adminAuthRegister(email, password, nameFirst, nameLast) {

    return id;
}





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





// Description:
// Given an admin user's authUserId, return details about the user. "name" is the first and last name 
// concatenated with a single space between them.

function adminUserDetails(authUserId) {
    return {
        user:
        {
            userId: 1,
            name: 'Hayden Smith',
            email: 'hayden.smith@unsw.edu.au',
            numSuccessfulLogins: 3,
            numFailedPasswordsSinceLastLogin: 1,
        }
    }
}





// Description:
// Given an admin user's authUserId and a set of properties, update the properties of this logged in admin user.

function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast) {
    return {
 
    }
}





// Description:
// Given details relating to a password change, update the password of a logged in user.

function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
    return {
       
    }
}






