import httpStatus from "http-status";
import ApiError from "../utils/api-error.js"

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

// middleware to handle error
const errorHandler = (err, req, res, next) => {
  let { statusCode = 400, message } = err;

  res.locals.errorMessage = err.message;
  res.locals.stack = err.stack;

  const response = {
    code: statusCode,
    message,
    stack: err.stack,
  };

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
