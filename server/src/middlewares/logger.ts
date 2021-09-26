// Logging Level
// error - exception,
// warn - need to take attention,
// info - useful info in server, blockhain still using info
// http - req, res,
// verbose - mongdo crud,
// debug - debug/dev purpose,

import winston, { format, transports } from 'winston';
import { MongoDBTransportInstance } from 'winston-mongodb';
const {
  MongoDB,
}: { MongoDB: MongoDBTransportInstance } = require('winston-mongodb');

import util from 'util';

// Enable dotenv
import dotenv from 'dotenv';
dotenv.config();

const { inspect } = util;

function isPrimitive(val) {
  return val === null || (typeof val !== 'object' && typeof val !== 'function');
}

function formatWithInspect(val) {
  const prefix = isPrimitive(val) ? '' : '\n';
  const shouldFormat = typeof val !== 'string';

  return (
    prefix +
    (shouldFormat ? inspect(val, { depth: null, maxArrayLength: null }) : val)
  );
}

const logFormatConfig = [
  format.json(),
  format.timestamp({
    format: 'DD-MM-YYYY HH:mm:ss',
  }),
  format.align(),
  format.printf((info) => {
    const msg = formatWithInspect(info.message);
    const splatArgs = info[Symbol.for('splat') as any] || [];
    const rest = splatArgs.map((data) => formatWithInspect(data)).join(' ');
    return `${[info.timestamp]}: [${info.level}]: ${msg} ${rest}`;
  }),
];

// Format: DD/MM/YYYY
const getTodayDate = () => {
  const todayDate = new Date();

  return `${todayDate.getFullYear()}${todayDate.getMonth()}${todayDate.getDate()}`;
};

const transportsConfig =
  process.env.NODE_ENV === 'production'
    ? [
        new MongoDB({
          collection: 'server_logs',
          db: process.env.DB_CONNECTION,
          options: { useUnifiedTopology: true },
          level: 'verbose',
        }),
      ]
    : [
        new transports.File({
          filename: `logs/masscheck-${getTodayDate()}.log`,
          format: winston.format.combine(...logFormatConfig),
          level: 'debug',
        }),
        new transports.Console({
          format: winston.format.combine(format.colorize(), ...logFormatConfig),
          level: 'debug',
        }),
      ];

const logConfiguration = {
  transports: transportsConfig,
};

const logger = winston.createLogger(logConfiguration);

export { logger };
