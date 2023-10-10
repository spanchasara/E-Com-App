// custom error handler class
class ApiError extends Error {
  statusCode;
  serverMessage;
  stack;

  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.serverMessage = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
