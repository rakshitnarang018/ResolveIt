/**
 * Custom error handling middleware.
 * This function will catch any errors passed to `next(error)` in your controllers.
 * It ensures a consistent JSON error response format.
 */
const errorHandler = (err, req, res, next) => {
  // Determine the status code. If the error object has a statusCode, use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;

  // Log the error for debugging purposes (on the server, not sent to client)
  console.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // Only show stack in development
    path: req.path,
    method: req.method,
  });

  // Send a structured error response to the client
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred on the server.',
    // Optionally, you can include more details in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
