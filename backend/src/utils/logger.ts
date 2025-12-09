import chalk from 'chalk';

const getTime = () => new Date().toISOString();

export const logger = {
  info: (msg: string) =>
    console.log(chalk.blue(`[INFO ${getTime()}] ${msg}`)),

  success: (msg: string) =>
    console.log(chalk.green(`[SUCCESS ${getTime()}] ${msg}`)),

  warn: (msg: string) =>
    console.warn(chalk.yellow(`[WARN ${getTime()}] ${msg}`)),

  error: (msg: string) =>
    console.error(chalk.red(`[ERROR ${getTime()}] ${msg}`)),
};
