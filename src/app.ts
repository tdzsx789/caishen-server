import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import morgan from 'morgan';
import routes from './routes';
import ApiError from './utils/ApiError';
import config from './config/config';

const app = express();

if (config.env !== 'test') {
  app.use(morgan('combined'));
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());

// v1 api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'development' && !statusCode) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
  if (!err.isOperational) {
    statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    console.error(err);
  }

  res.status(statusCode).send(response);
});

export default app;
