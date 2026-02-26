const fs = require('fs');
const mongoose = require('mongoose');
const dotevnv = require('dotenv');
const Tour = require('./../../models/tourModel');
dotevnv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB is successful'));
//READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//IMPORT THE DATA
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('DB succesfully imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
//DELETING THE DATA
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data is succesfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
