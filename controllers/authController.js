const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('./../utils/appError');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exists
  if (!email && !password) {
    return next(new appError('Please provide email and password'), 400);
  }
  //check if the user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Incorrect email or password', 401));
  }
  //if everything ok,send the json web token
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  //getting the token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('You are not logged in! please login', 401));
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check is user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new appError(
        'The user belonging to this token does no longer exists',
        401,
      ),
    );
  }
  //check if user has changed password
  if (freshUser.changedPassword(decoded.iat)) {
    return next(
      new appError(
        'Recenly yout password has changed! please login agian',
        401,
      ),
    );
  }
  next();
});
