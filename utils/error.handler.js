const ERROR_CODES = {
  ALREADY_EXIST: {
    status: 409,
    error: 'User already exists',
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    error: 'An unexpected error occurred',
  },
  NOT_FOUND: {
    status: 404,
    error: 'Resource not found',
  },
  UNAUTHORIZED: {
    status: 401,
    error: 'Unauthorized access',
  },
  BAD_REQUEST: {
    status: 400,
    error: 'Invalid input or request',
  },
};

// Export the error codes
module.exports = {
  ERROR_CODES,
};
