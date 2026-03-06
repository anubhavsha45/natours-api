const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./buildFactory');
exports.setTourId = (req, res, next) => {
  if (!req.body.tour) req.body.tours = req.params.tourId;
  if (!req.user.user) req.body.user = req.user.id;
  next();
};
exports.getReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
