import winston, { LoggerOptions } from 'winston';
import DailyRotateFile, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

interface LoggerConfig {
  level: LoggerOptions['level'];
  logFiles: DailyRotateFileTransportOptions[];
}

const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  logFiles: [
    { filename: './logs/error', level: 'error', extension: '.log' },
    { filename: './logs/combined', extension: '.log' },
  ],
};

export class Logger {
  constructor(config: LoggerConfig = DEFAULT_CONFIG) {
    const { level, logFiles } = config;

    const myFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const caller = Object.values(meta).join('');

      if (!caller) {
        return `${timestamp} [${level}]: ${message}`;
      }

      const callerName = caller.charAt(0).toUpperCase() + caller.slice(1);

      return `${timestamp} [${callerName}] [${level}]: ${message}`;
    });

    const transports = logFiles.map((fileConfig) => {
      return new DailyRotateFile(fileConfig);
    });

    const logger = winston.createLogger({
      level,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports,
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.splat(),
            myFormat,
          ),
          level: 'debug',
        }),
      );
    }

    const loggerLevels = Object.keys(logger.levels);

    const objElements = loggerLevels
      .map((level) => {
        return {
          [level]: logger[level].bind(logger),
        };
      })
      .concat({
        stream: {
          write: (message: string) => {
            logger.info(message);
          },
        },
      });

    Object.assign(this, ...objElements);
  }

  error: winston.LeveledLogMethod;

  warn: winston.LeveledLogMethod;

  info: winston.LeveledLogMethod;

  http: winston.LeveledLogMethod;

  verbose: winston.LeveledLogMethod;

  debug: winston.LeveledLogMethod;

  silly: winston.LeveledLogMethod;
}
