const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_LOGIN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected to the database');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
