const mongoose = require('mongoose');
const dotevnv = require('dotenv');
dotevnv.config({ path: './config.env' });
const app = require('./app');
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
