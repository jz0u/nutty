// Centralized error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const response = {
    message: error.message || "Internal Server Error",
  };

  // Only include stack in non-production environments
  if (process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };


