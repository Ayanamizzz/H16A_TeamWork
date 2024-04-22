import fs from 'fs';

export interface name {
  nameFirst: string;
  nameLast: string;
  nameFull: string;
}

export interface user {
  userId: number;
  name: name;
  email: string;
  password: string;
  numFailedPasswordsSinceLastLogin: number;
  numSuccessfulLogins: number;
  quizzesCreated: number[];
  pastPasswords: string[];
}

export interface token {
  authUserId: number;
  token: string;
}

export enum Colours {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  PURPLE = 'purple',
  PINK = 'pink'
}

export interface option {
  answer: string;
  correct: boolean;
  colour: Colours;
  answerId: number;
}

export interface question {
  questionId: number;
  duration: number;
  points: number;
  answers: option[];
}

export interface quiz {
  quizName: string;
  quizId: number;
  description: string;
  authorUserId: number;
  questionBank: question[];
  timeCreated: string;
  timeLastEditted: string;
  thumbnailUrl: string;
}

export interface returnObject {
  quizId: number;
  name: string;
}

export interface iniQuizzes {
  quizzes: returnObject[];
}

export enum State {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export enum Action {
  NEXT_QUESTION = 'NEXT_QUESTION',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  FINISH_COUNTDOWN = 'FINISH_COUNTDOWN',
  END = 'END'
}


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
export const getData = () => {
  const data = fs.readFileSync('./dataStore.json');
  return JSON.parse(String(data));
};

// Use set(newData) to pass in the entire data object, with modifications made
export const setData = (newData : any) => {
  const data = JSON.stringify(newData);
  fs.writeFileSync('./dataStore.json', data);
};

