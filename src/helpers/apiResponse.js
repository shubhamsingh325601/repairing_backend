// Success Response (200 OK)
const successResponse = (res, data = [], message = "Success", code = 200) => {
  return res.status(code).json({
    isSuccess: true,
    message,
    data,
  });
};

// Fail Response (400+ errors, 404 not found, etc.)
const failedResponse = (res, message = "Failed", code = 400, data = []) => {
  return res.status(code).json({
    isSuccess: false,
    message,
    data,
  });
};

// Server Error Response (500 Internal Server Error)
const errorResponse = (res, error, message = "Server error", code = 500) => {
  console.log("Error:", error?.message || error);
  return res.status(code).json({
    isSuccess: false,
    message,
    data: [],
    error: error?.message || error,
  });
};

// For internal use, e.g., in services or queries
const failedStatus = (error, message = "Server error") => {
  return {
    isSuccess: false,
    message,
    data: [],
    error: error?.message || error,
  };
};

module.exports = {
  successResponse,
  failedResponse,
  errorResponse,
  failedStatus,
};
