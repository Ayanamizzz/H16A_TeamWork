import { setData } from '../dataStore';
import fs from 'fs';
import path from 'path';

type resetData = {
  users: [],
  quizzes: [],
  tokens: [],
  trash:[],
  quizSessions: []
}

/**
 * @param empty object
 * @returns empty object
 */
export function clear(): Record<string, never> {
  const resetData:resetData = {
    users: [],
    quizzes: [],
    tokens: [],
    trash: [],
    quizSessions: []
  };
  deleteDirectoryContentsSync('./images');
  setData(resetData);
  return {};
}

function deleteDirectoryContentsSync(directoryPath: string) {
  const files = fs.readdirSync(directoryPath);
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    if (file !== '.gitkeep') {
      fs.unlinkSync(filePath);
    }
  });
}
