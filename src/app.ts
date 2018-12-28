import 'reflect-metadata';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

import * as winston from 'winston';
import * as compression from 'compression';
import { di } from './di';
import { config } from './config';
import { mongodb } from './mongodb';

import { router as order } from './routers/order';
import { router as quotation } from './routers/quotation';
import { router as driver } from './routers/driver';

startServer();

async function startServer() {
  let db = await mongodb.connect();
  di.set('db', db);
  // log setting
  let logDirectory = path.join(__dirname, 'logs');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  let logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: 'debug',
        filename: `${logDirectory}/application.log`,
        timestamp: () => {
          return moment().toISOString();
        }
      }),
      new winston.transports.Console({
        level: 'debug',
        timestamp: () => {
          return moment().toISOString();
        }
      })
    ]
  });
  logger.debug(`------->${new Date()}<-------`);
  di.set('log', logger);

  const app = express();
  const urlencoded = bodyParser.urlencoded({ extended: true });
  const rawParser = bodyParser.raw({ type: function () { return true; }, limit: '30mb' });
  const jsonParser = bodyParser.json({ limit: '30mb' });
  const middleware = [jsonParser, urlencoded];

  const checkTokenExpired = (expressRouter, message) => {
    expressRouter.use((req, res, next) => {
      const date = new Date();
      if (req.user && date.getTime() > req.user.exp) {
        res.status(401).json({ message });
      }
      next();
    });
  };

  let timeout = require('connect-timeout');
  app.use(compression());
  app.use(timeout(300000));

  app.use(morgan('dev'));
  app.use(cors());

  // app.use(bodyParser.json({ limit: '30mb' }));
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.use(jwt({ secret: config.jwt.secret }).unless({
    path: [
      new RegExp('/healthcheck'),
      // new RegExp('/v1/transfer'), // for transfer data from dev to prd
    ],
  }));
  app.get('/healthcheck', (req, res) => {
    res.json({ message: 'petdeego-api ok v.0.0.0.0.1' });
  });

  app.use(async (req, res, next) => {
    let date = new Date();
    if (req.user && date.getTime() > req.user.exp) {
      res.status(401).json({ message: 'Your token was expired' });
    }
    next();
  });

  const createRoute = () => {
    const router = express.Router();
    checkTokenExpired(router, 'TOKEN_EXPIRED');

    app.use('/api/v1/order', order);
    app.use('/api/v1/quotation', quotation);
    app.use('/api/v1/driver', driver);

    return router;
  };

  createRoute();

  app.use(([body, status], req, res, next) => {
    res.status(status).json(body);
    next();
  });
  app.listen(5001);
}
