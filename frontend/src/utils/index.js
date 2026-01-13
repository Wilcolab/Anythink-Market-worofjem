/**
 * CONSOLIDATED FRONTEND UTILITIES
 * 
 * Common frontend utility functions used across components and reducers.
 * Consolidates repeated patterns to reduce code duplication.
 * 
 * Includes:
 * - Redux action helpers
 * - Component utilities
 * - Form validation
 * - API request helpers
 * - Common constants
 * 
 * Space Complexity: Eliminates duplication across components
 */

/**
 * API request wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - JSON response
 */
async function apiCall(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') && {
        'Authorization': `Token ${localStorage.getItem('token')}`
      }),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = new Error('API Error');
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      error.message = response.statusText;
    }
    throw error;
  }

  return response.json();
}

/**
 * GET request helper
 * @param {string} url - API endpoint
 * @returns {Promise} - Response data
 */
function apiGet(url) {
  return apiCall(url, { method: 'GET' });
}

/**
 * POST request helper
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
function apiPost(url, data) {
  return apiCall(url, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT request helper
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise} - Response data
 */
function apiPut(url, data) {
  return apiCall(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request helper
 * @param {string} url - API endpoint
 * @returns {Promise} - Response data
 */
function apiDelete(url) {
  return apiCall(url, { method: 'DELETE' });
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
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with details
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  // Less than 1 minute
  if (diff < 60000) return 'just now';
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 1 month
  if (diff < 2592000000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Format as date
  return d.toLocaleDateString();
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} - Truncated text
 */
function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length - 3) + '...';
}

/**
 * Debounce function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function
 */
function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function calls
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} - Throttled function
 */
function throttle(fn, delay = 300) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Local storage helper with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store (optional)
 * @returns {*} - Stored value if getter, or null
 */
function storage(key, value) {
  if (value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}

/**
 * Redux action creator helper
 * @param {string} type - Action type
 * @param {*} payload - Action payload
 * @returns {Object} - Redux action
 */
function createAction(type, payload) {
  return { type, payload };
}

/**
 * Batch Redux actions
 * @param {Array} actions - Actions to dispatch
 * @returns {Object} - Batch action
 */
function batchActions(actions) {
  return {
    type: 'BATCH_ACTIONS',
    payload: actions
  };
}

/**
 * Selector helper for memoization
 * @param {Function} selector - Selector function
 * @param {Array} deps - Dependencies
 * @returns {Function} - Memoized selector
 */
function createSelector(selector, deps = []) {
  let lastResult;
  let lastDeps;

  return (...args) => {
    const newDeps = deps.map(d => d(...args));
    
    if (!lastDeps || newDeps.some((d, i) => d !== lastDeps[i])) {
      lastDeps = newDeps;
      lastResult = selector(...args);
    }
    
    return lastResult;
  };
}

/**
 * Handle async API calls with loading state
 * @param {Function} asyncFn - Async function
 * @param {Function} dispatch - Redux dispatch
 * @param {Object} actions - { start, success, error }
 */
async function handleAsyncAPI(asyncFn, dispatch, actions) {
  try {
    dispatch(actions.start());
    const result = await asyncFn();
    dispatch(actions.success(result));
    return result;
  } catch (error) {
    dispatch(actions.error(error.message));
    throw error;
  }
}

/**
 * Common error messages
 */
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  DUPLICATE_USER: 'Username or email already exists.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

/**
 * Common success messages
 */
const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  PUBLISHED: 'Published successfully.',
  SAVED: 'Saved successfully.'
};

module.exports = {
  // API helpers
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  
  // Validation
  isValidEmail,
  validatePassword,
  
  // Text utilities
  formatDate,
  truncateText,
  
  // Function utilities
  debounce,
  throttle,
  
  // Storage
  storage,
  
  // Redux helpers
  createAction,
  batchActions,
  createSelector,
  handleAsyncAPI,
  
  // Constants
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
