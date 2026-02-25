const fs = require('fs');
const Tour = require('./../models/tourModel');
/* exports.checkID = (req, res, next, val) => {
  console.log(`the id is ${val}`);
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  next();
}; */
exports.checkBody = (req, res, next, body) => {
  console.log(`the body is ${req.body}`);
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'should contain body and the price',
    });
  }
  next();
};
exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    /* result: tours.length,
    data: {
      tours,
    }, */
  });
};
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  /* const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  }); */
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<Updated tour here>',
    },
  });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
