export const errorHandler = (errMessage, statusCode) => {
  const error = new Error();
  error.message = errMessage;
  error.statusCode = statusCode;
  return error;
};
