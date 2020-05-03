const mongoose = require('mongoose');
const HttpError = require('../utils/httpError');

exports.connectDB = async () => {
    const con = await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    );
    console.log(`mongoDB Connected ${con.connection.host}`);

};
