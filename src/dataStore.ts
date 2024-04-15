export interface User {
  userId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  oldPasswords: Array<string>;
  token: Array<string>;
}

export interface Answer {
    answerId: number;
    answer: string;
    colour: string;
    correct: boolean
}

export interface Question {
    questionId: number;
    question: string;
    duration:number;
    points: number;
    answers: Array<Answer>
}

export interface Quiz {
  quizId: number;
  name: string;
  description: string;
  timeCreated: number;
  timeLastEdited: number;
  ownerId: number;
  questions:Array<Question>;
  numQuestions:number;
  duration:number;

  thumbnailUrl?: string;
  sessions: Session[];
}

export interface Session {
  sessionId: number,
  userId: number,
  autoStartNum: number,
  state: QuizState,
  atQuestion: number,
  timeElapsed: number,
  timer: ReturnType<typeof setTimeout>,
  players: Player[],
  questionResults: QuestionResult[],
  chat: ChatMessage[],
  quiz: QuizCopy,
}

export enum QuizState {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export interface ChatMessage {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number,
}

export interface QuizCopy {
  quizId: number,
  name: string,
  description: string,
  timeCreated: number,
  timeLastEdited: number,
  ownerId: number,
  questions:Array<Question>;
  numQuestions: number,
  duration: number,

  thumbnailUrl?: string,
}



export interface Player {
  playerId: number,
  name: string,
}

export interface QuestionResult {
  questionId: number,
  playersCorrectListAndScore: PlayerQuestionResult[],
  playersIncorrectList: string[],
  totalAnswerTime: number,
}

export interface PlayerQuestionResult {
  name: string,
  score: number
}


export interface Data {
  users: User[];
  quizzes: Quiz[];
  quizzesTrash: Quiz[];
  sessions: Session[];
}

let data: Data = {
  users: [],
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
