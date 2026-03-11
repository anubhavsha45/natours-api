//module imports
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const viewRoute = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController');
const app = express();
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//SECUIRTY HTTP HEADERS
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        'https://cdn.jsdelivr.net',
        'https://js.stripe.com',
      ],

      connectSrc: [
        "'self'",
        'https://cdn.jsdelivr.net',
        'https://api.stripe.com',
        'https://m.stripe.network',
      ],

      frameSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.stripe.com',
      ],

      imgSrc: ["'self'", 'data:', 'https://*.stripe.com'],
    },
  }),
);

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//BODY PARSER||READING DATAA FROM REQ.BODY

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZE AGAINST XSS
app.use(xss());

//PREVENT PARAMATER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  }),
);

//LIMIT REQUEST FROM THE SAME IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP,please try again in an hour',
});
app.use('/api', limiter);

//MOUNTED ROUTES
app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRouter);

//INVALID ROUTE
app.all('*', (req, res, next) => {
  next(
    new appError(`Cant get the route ${req.originalUrl} on this server`, 404),
  );
});

//ERROR MIDDLEWARE
app.use(globalErrorHandler);
module.exports = app;
