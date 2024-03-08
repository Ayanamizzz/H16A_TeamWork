```javascript
const data = {
    // TODO: insert your data structure that contains 
    // users + quizzes here

    // example users as below:
    // each index referring a user
    users: [
        {
            authUserId: 5437798, // Id of a user
            email: '1010284295@qq.com', // email used to login
            password: '114514', // password used to login
            nameFirst: 'MA', // First name of user
            nameLast: 'JIN', // Last name of user
            name: 'MA JIN', // nameFirst + ' ' + nameLast
            numSuccessfulLogins: 1, // times that successful login
            numFailedPasswordsSinceLastLogin: 0, // time that faild login due to incorrect password

        },
    ],

    // example quizzes as below:
    // each index referring a quiz
    quizzes: [
        {
            quizId: 5, // Id of a quiz
            name: 'group_quiz', // name of quiz
            description: 'hahahaha', // description of quiz
            timeCreated: '12/03/2024', // time that created this quiz
            timeLastEdited: '14/03/2024', // time that last edited this quiz
            ownerId: 2 // Id of user that owns this quiz

        }
    ]
}


[Optional] short description:
