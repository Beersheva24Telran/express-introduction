import fs from'node:fs';
import morgan from 'morgan';
const logStream = fs.createWriteStream("log.txt");
const morganType = config.get("morgan.type");
export const loggerCombined = morgan(morganType, {
    stream: process.stdout,
  });