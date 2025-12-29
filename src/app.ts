import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
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
app.use(cors({
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（例如移动端 APP 或 curl 请求）
    if (!origin) return callback(null, true);
    // 允许所有来源（或者你可以指定具体的域名数组，如 ['http://13.212.168.127', 'http://localhost:8000']）
    return callback(null, true);
  },
  credentials: true, // Important: Allow cookies to be sent
}));

// session configuration
app.use(
  session({
    secret: 'caishen-server-secret-key', // In production, this should be in .env
    resave: false,
    saveUninitialized: false, // Fix 1: Only save session when data is modified
    store: MongoStore.create({
      mongoUrl: config.mongoose.url,
      collectionName: 'sessions',
      ttl: 30 * 24 * 60 * 60, // 30 days
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

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
