const appError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./buildFactory');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getUsers = factory.getAll(User);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Use signup for this action',
  });
};
exports.getUser = factory.getOne(User);
//DO NOT UPDATE PASSWORD HERE
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsync(async (req, res, next) => {
  //GET THE USER
  const user = await User.findById(req.user.id);
  //send the error response if user altered the password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'You cant not change the password on this route! for that go to the /updatePassword route',
        400,
      ),
    );
  }
  //filter the req.body field
  const filteredObj = filterObj(req.body, 'name', 'email');
  //update the  fields
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  //GET THE USER
  const user = await User.findById(req.user.id);
  //delete
  user.active = false;
  await user.save();
  //send the response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
