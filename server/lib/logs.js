import winston from 'winston';
import moment  from 'moment';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: () => {
        return `${moment(new Date()).format('DD/MM/YYYY HH:mm:ss.SSS')}`;
      }
    })
  ]
});

export default logger;
