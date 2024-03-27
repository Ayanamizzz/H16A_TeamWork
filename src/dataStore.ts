export interface User {
  userId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  token: Array<string>;
}

export interface Quiz {
  quizId: number; 
  name: string; 
  description: string;
  timeCreated: number;
  timeLastEdited: number;
  authUserId: number;
  ownerId: number

}

export interface Session {
  sessionId: number,
  userId: number,
}

export interface Data {
  users: User[];
  quizzes: Quiz[];
  quizzesTrash: Quiz[];
  sessions: Session[];
}

let data: Data = {
  users:[],
  quizzes: [],
  quizzesTrash: [],
  sessions: [],
};
  

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Data) {
  data = newData;
}

export { getData, setData };
