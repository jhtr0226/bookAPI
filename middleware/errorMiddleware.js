const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });


  // Handle Duplicate Key Errors
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: {
        message: `Duplicate value for field: ${duplicateField}`,
      },
    });
  }


  // Generic Error Handling
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  });
};







module.exports = errorMiddleware;
