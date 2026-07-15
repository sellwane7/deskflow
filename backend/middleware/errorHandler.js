// Catches 404s for unknown routes
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Centralized error handler - keeps the server from crashing on bad input
const errorHandler = (err, req, res, next) => {
  console.error(`[DeskFlow] Error: ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: `Invalid ID format: ${err.value}` });
  }

  // Duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ');
    return res.status(400).json({ success: false, message: `Duplicate value for field: ${field}` });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
  });
};

module.exports = { notFound, errorHandler };
