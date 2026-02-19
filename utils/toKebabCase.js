/**
 * Step 3: Function that converts a string to kebab-case with error handling
 * Converts to lowercase and replaces spaces with hyphens
 * Validates input and returns error messages for invalid inputs
 * @param {string} str - The input string
 * @returns {string|object} - The kebab-case string or error object
 */
const toKebabCase = (str) => {
  // Error Handling: Check if input is null or undefined
  if (str === null || str === undefined) {
    return {
      error: true,
      message: 'Error: Input cannot be null or undefined'
    };
  }

  // Error Handling: Check if input is a valid string
  if (typeof str !== 'string') {
    return {
      error: true,
      message: `Error: Input must be a string, received ${typeof str}`
    };
  }

  // Error Handling: Check if string is empty after trimming
  if (str.trim().length === 0) {
    return {
      error: true,
      message: 'Error: Input cannot be an empty string'
    };
  }

  // Success: Convert to kebab-case
  return str.toLowerCase().replace(/\s+/g, '-');
};

module.exports = toKebabCase;
