const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');
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

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find bookings for logged in user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Extract tour IDs
  const tourIDs = bookings.map((el) => el.tour);

  // 3) Find tours
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  // 4) Render overview
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new appError('There is no tour with that name.', 404));
  }
  let booked = false;

  if (req.user) {
    const booking = await Booking.findOne({
      tour: tour._id,
      user: req.user._id,
    });

    if (booking) booked = true;
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    booked,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};
