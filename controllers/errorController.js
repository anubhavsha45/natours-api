const appError = require('./../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new appError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(.*?)\1/)[0];
  const message = `Duplicate field value x .Please use another value`;
  return new appError(message, 400);
};
const handleValidationEror = (err) => {
  const errors = Object.values(err.erros).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new appError(message, 400);
};
const handleJWTError = () =>
  new appError('Invalid token!please login again', 401);
const handleJWTExpriedError = () => {
  new appError('Your token has expired!please login again', 401);
};
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err, res) => {
  //error is operational
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //log error
    console.error('ERROR ', err);
    //send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationEror(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpriedError') error = handleJWTExpriedError();
    sendErrProd(error, res);
  }
};
