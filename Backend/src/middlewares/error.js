import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";

// middleware to controll error
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, err.stack);
  }
  next(error);
};

const handleDuplicateFieldsMongo = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

const handleValidationErrorMongo = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

// middleware to handle error
const errorHandler = (err, req, res, next) => {
  res.locals.errorMessage = err.message;
  res.locals.stack = err.stack;

  if (err.code === 11000) err = handleDuplicateFieldsMongo(err);
  if (err.name === "ValidationError") err = handleValidationErrorMongo(err);

  let { statusCode = httpStatus.BAD_REQUEST, message } = err;

  const response = {
    code: statusCode,
    message,
    stack: err.stack,
  };

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
