const httpError = require('../utils/httpError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose Bad object id
  if (err.name === 'CastError') {
    const message = `Resourse not found`;
    error = new httpError(message, 404);
  }

  // Mongoose Duplecate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new httpError(message, 400);
  }

  // Mongoose validation error
  if (err.name == 'validationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new httpError(message, 400);
  }

  // res.headerSent is a boolean value that indicates
  // whether the headers have already been sent to the client.
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || 'An Unknown error occured!' });
};

module.exports = errorHandler;
