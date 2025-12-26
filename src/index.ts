import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import connectDB from './config/db';

// Connect to MongoDB
connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  process.exit(1);
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  process.exit(0);
});
