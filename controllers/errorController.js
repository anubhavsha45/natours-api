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
const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR 💥', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong',
      msg: err.message,
    });
  }

  console.error('ERROR 💥', err);

  return res.status(500).render('error', {
    title: 'Something Went Wrong',
    msg: 'Please try again later!',
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationEror(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpriedError') error = handleJWTExpriedError();
    sendErrProd(error, req, res);
  }
};
