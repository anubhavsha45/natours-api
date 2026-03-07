const mongoose = require('mongoose');
const Tour = require('./tourModel.js');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please provide the review'],
      trim: true,
    },
    rating: {
      type: Number,
      max: [5, 'A review rating must be 5 or below 5.0'],
      min: [1, 'A review rating must be above 1.0'],
    },
    tours: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must be about some tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.static.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^fineOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^fineOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
