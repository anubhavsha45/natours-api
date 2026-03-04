//module imports
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

//middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour',
});
app.use('/api', limiter);
//mounted routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.all('*', (req, res, next) => {
  next(
    new appError(`Cant get the route ${req.originalUrl} on this server`, 404),
  );
});
app.use(globalErrorHandler);
module.exports = app;
