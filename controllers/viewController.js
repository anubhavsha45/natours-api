const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
exports.getOverview = catchAsync(async (req, res) => {
  //GET TOURS FROM THE COLLECTION
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  //GET THE TOUR BASED ON TOUR PARAM
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new appError('There was no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: 'The forest Hiker tour',
    tour,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};
