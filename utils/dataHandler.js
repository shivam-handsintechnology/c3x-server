const sendResponse = (res, statusCode = 500, data, message = "Success") => {
  const response = { statusCode, message, data }
  return res.status(statusCode).json(response)
}
const errorHandler = (res, statusCode = 500, error) => {

  let message = "Internal server error";
  console.log(error);
  // Checking for MongoDB duplicate key error
  if (error.code === 11000) {
    ////console.log("error>>>>>>>", error)
    message = "";
    if (error.name === "MongoBulkWriteError") {
      let leyvalue = error.writeErrors
      message = "bulerro"
      ////console.log(error.writeErrors)
      if (error.writeErrors && error.writeErrors.length > 0) {

      }
    } else {

      // Extracting the duplicated field from the error message
      const field = Object.keys(error.keyValue)[0];
      message += `The value for the ${field} field already exists.`;
      statusCode = 400; // Bad Request
    }

  }
  if (error.name === "Error") {
    message = "";

    message = error.message;
    statusCode = 400; // Bad Request
  }
  if (error.name === "AxiosError") {
    message = "";
    message = error.message;
    statusCode = 400; // Bad Request
  }

  // Checking for MongoDB validation errors (e.g., required fields)
  if (error.name === 'ValidationError') {
    message = "";
    const errors = Object.values(error.errors).map(el => el.message);
    message += errors.join(', ');
    statusCode = 400; // Bad Request
  }

  // Overriding message if provided
  if (typeof error === 'string') {
    message = error;
  }

  const response = { statusCode, message };
  res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  errorHandler
}