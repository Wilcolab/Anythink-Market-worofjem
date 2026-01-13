// Write a JavaScript function toCamelCase that converts strings to camelCase.
// Here are some examples:
// first name → firstName
// user_id → userId
// SCREEN_NAME → screenName
// mobile-number → mobileNumber
// Implement the function to handle these cases.

/**
 * Converts a string to camelCase format
 * @param {string} str - The input string to convert
 * @returns {string} - The converted camelCase string
 * @throws {Error} - If input is null, undefined, or not a string
 */
function convertToCamelCase(str) {
  // Input validation - throw error for null or undefined
  if (str === null || str === undefined) {
    throw new Error('Input cannot be null or undefined');
  }
  
  // Validate input is a string
  if (typeof str !== 'string') {
    throw new Error(`Input must be a string, received ${typeof str}`);
  }
  
  // Trim extra whitespace and handle empty strings
  const trimmedStr = str.trim();
  if (trimmedStr === '') {
    return '';
  }
  
  // Split by multiple consecutive separators (spaces, underscores, hyphens)
  // and filter out empty values from splits
  return trimmedStr
    .toLowerCase()
    .split(/[\s_\-]+/)
    .filter(word => word.length > 0)
    .map((word, index) =>
      index === 0 
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

module.exports = convertToCamelCase;

// Test cases with error handling:
console.log('=== Valid Examples ===');
console.log(convertToCamelCase('first name'));           // Output: firstName
console.log(convertToCamelCase('user_id'));              // Output: userId
console.log(convertToCamelCase('SCREEN_NAME'));          // Output: screenName
console.log(convertToCamelCase('mobile-number'));        // Output: mobileNumber
console.log(convertToCamelCase('  hello   world  '));    // Output: helloWorld
console.log(convertToCamelCase('hello___world---test')); // Output: helloWorldTest

console.log('\n=== Error Handling Examples ===');

// Error handling for null input
try {
  convertToCamelCase(null);
} catch (e) {
  console.error('Error (null):', e.message);
}

// Error handling for undefined input
try {
  convertToCamelCase(undefined);
} catch (e) {
  console.error('Error (undefined):', e.message);
}

// Error handling for non-string input (number)
try {
  convertToCamelCase(123);
} catch (e) {
  console.error('Error (number):', e.message);
}

// Error handling for non-string input (object)
try {
  convertToCamelCase({});
} catch (e) {
  console.error('Error (object):', e.message);
}
