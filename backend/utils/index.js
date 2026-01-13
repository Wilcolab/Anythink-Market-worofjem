/**
 * CONSOLIDATED BACKEND UTILITIES
 * 
 * This module consolidates common backend patterns to reduce code duplication
 * and improve maintainability.
 * 
 * Includes:
 * - Error handling utilities
 * - Request validation
 * - Response formatting
 * - Common middleware patterns
 * 
 * Space Complexity: Reduced duplication across routes
 */

/**
 * Standard error response format
 * @param {Error} error - The error object
 * @param {number} status - HTTP status code
 * @returns {Object} - Formatted error response
 */
function formatError(error, status = 500) {
  return {
    errors: {
      message: error.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    }
  };
}

/**
 * Standard success response format
 * @param {*} data - Response data
 * @param {Object} meta - Optional metadata
 * @returns {Object} - Formatted response
 */
function formatSuccess(data, meta = {}) {
  return {
    data,
    ...meta
  };
}

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - Required field names
 * @throws {Error} - If any required field is missing
 */
function validateRequiredFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field] || body[field].toString().trim() === '') {
      throw new Error(`${field} is required`);
    }
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Validate username format (alphanumeric only)
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
function isValidUsername(username) {
  return /^[a-zA-Z0-9]+$/.test(username);
}

/**
 * Wrap async route handlers with error catching
 * @param {Function} fn - Async handler function
 * @returns {Function} - Express middleware
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Verify user is authenticated
 * @param {Object} req - Express request
 * @throws {Error} - If not authenticated
 */
function requireAuth(req) {
  if (!req.user) {
    const error = new Error('Unauthorized');
    error.status = 401;
    throw error;
  }
}

/**
 * Verify user can modify resource
 * @param {string} resourceOwnerId - Owner ID from database
 * @param {string} userId - Current user ID
 * @throws {Error} - If user doesn't own resource
 */
function verifyOwnership(resourceOwnerId, userId) {
  if (resourceOwnerId.toString() !== userId.toString()) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }
}

/**
 * Paginate array results
 * @param {Array} items - Items to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} - Paginated results with metadata
 */
function paginate(items, page = 1, limit = 10) {
  const total = items.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Database query error handler
 * @param {Error} error - Database error
 * @throws {Error} - Formatted error
 */
function handleDbError(error) {
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    const err = new Error(`${field} already exists`);
    err.status = 409;
    throw err;
  }
  if (error.name === 'ValidationError') {
    const err = new Error(error.message);
    err.status = 400;
    throw err;
  }
  throw error;
}

/**
 * Log request details (with optional filtering)
 * @param {Object} req - Express request
 * @param {string} action - Action description
 */
function logRequest(req, action) {
  if (process.env.LOG_LEVEL === 'debug') {
    console.log(`[${new Date().toISOString()}] ${action} - ${req.method} ${req.path}`, {
      user: req.user?.id,
      params: req.params,
      query: req.query
    });
  }
}

/**
 * Rate limiting check (in-memory, simple implementation)
 * For production, use redis-based solution
 */
const requestCounts = new Map();

function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, 0);
  }
  
  const count = requestCounts.get(key);
  if (count >= maxRequests) {
    const error = new Error('Too many requests');
    error.status = 429;
    throw error;
  }
  
  requestCounts.set(key, count + 1);
  
  // Cleanup old entries
  if (requestCounts.size > 10000) {
    const cutoff = now - (windowMs * 2);
    for (const [k] of requestCounts.entries()) {
      const timestamp = parseInt(k.split(':')[1]) * windowMs;
      if (timestamp < cutoff) {
        requestCounts.delete(k);
      }
    }
  }
}

/**
 * Response time middleware factory
 * @returns {Function} - Express middleware
 */
function responseTime() {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  };
}

module.exports = {
  // Response formatting
  formatError,
  formatSuccess,
  
  // Validation
  validateRequiredFields,
  isValidEmail,
  isValidUsername,
  
  // Middleware helpers
  asyncHandler,
  responseTime,
  
  // Authentication
  requireAuth,
  verifyOwnership,
  
  // Data handling
  paginate,
  
  // Error handling
  handleDbError,
  
  // Utilities
  logRequest,
  checkRateLimit
};
