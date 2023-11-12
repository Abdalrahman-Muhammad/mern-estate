export const errorHandler = (statusCode, errMessage) => {
  const error = new Error();
  error.message = errMessage;
  error.statusCode = statusCode;
  return error;
};
