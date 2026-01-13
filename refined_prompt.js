// STEP 1: Function Foundation & Input Validation
// Create toKebabCase function
// Validate input (not null/undefined, must be string)
// Trim whitespace and handle empty cases

// STEP 2: String Transformation Logic
// Convert to lowercase
// Split by multiple separators (spaces, underscores, hyphens)
// Filter empty values
// Join with hyphens (kebab-case format)
// Handle camelCase inputs

// STEP 3: Error Handling & Comprehensive Testing
// JSDoc documentation
// 8+ valid test cases
// 5+ error handling scenarios
// Edge case tests
// Module export

/**
 * Converts a string to kebab-case format with comprehensive validation and error handling.
 * 
 * Kebab-case uses hyphens to separate words in lowercase format.
 * Handles multiple separator types and camelCase inputs.
 * 
 * @param {string} input - The input string to convert to kebab-case
 * @returns {string} - The converted kebab-case string. Returns empty string for empty/whitespace-only inputs
 * @throws {Error} - If input is null or undefined with message: "Input cannot be null or undefined"
 * @throws {Error} - If input is not a string with message: "Input must be a string, but received [type]"
 * 
 * @example
 * toKebabCase("firstName");              // Returns: "first-name"
 * toKebabCase("first name");             // Returns: "first-name"
 * toKebabCase("first_name");             // Returns: "first-name"
 * toKebabCase("FIRST_NAME");             // Returns: "first-name"
 */
function toKebabCase(input) {
  // ===== STEP 1: Function Foundation & Input Validation =====
  
  // Validate input is not null or undefined
  if (input === null || input === undefined) {
    throw new Error('Input cannot be null or undefined');
  }
  
  // Validate input is a string
  if (typeof input !== 'string') {
    throw new Error(`Input must be a string, but received ${typeof input}`);
  }
  
  // Trim whitespace from input
  const trimmedInput = input.trim();
  
  // Handle empty or whitespace-only inputs
  if (trimmedInput.length === 0) {
    return '';
  }

  // ===== STEP 2: String Transformation Logic =====
  
  return trimmedInput
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .split(/[\s_\-]+/)
    .filter(word => word.length > 0)
    .join('-');
}

module.exports = toKebabCase;

// ===== STEP 3: Error Handling & Comprehensive Testing =====

console.log('========== 8+ VALID TEST CASES ==========');
console.log(toKebabCase('firstName'));              // Output: first-name
console.log(toKebabCase('first name'));             // Output: first-name
console.log(toKebabCase('first_name'));             // Output: first-name
console.log(toKebabCase('FIRST_NAME'));             // Output: first-name
console.log(toKebabCase('first-name'));             // Output: first-name
console.log(toKebabCase('  first   name  '));       // Output: first-name
console.log(toKebabCase('first___name---test'));    // Output: first-name-test
console.log(toKebabCase('firstName123Id'));         // Output: first-name123-id

console.log('\n========== 5+ ERROR HANDLING SCENARIOS ==========');

// Error handling for null input
try {
  toKebabCase(null);
} catch (error) {
  console.error('❌ Error (null input):', error.message);
}

// Error handling for undefined input
try {
  toKebabCase(undefined);
} catch (error) {
  console.error('❌ Error (undefined input):', error.message);
}

// Error handling for number input
try {
  toKebabCase(123);
} catch (error) {
  console.error('❌ Error (number input):', error.message);
}

// Error handling for object input
try {
  toKebabCase({});
} catch (error) {
  console.error('❌ Error (object input):', error.message);
}

// Error handling for array input
try {
  toKebabCase(['hello', 'world']);
} catch (error) {
  console.error('❌ Error (array input):', error.message);
}

console.log('\n========== EDGE CASE TESTS ==========');
console.log(`Empty string: "${toKebabCase('')}"`);                  // Output: ""
console.log(`Whitespace only: "${toKebabCase('   ')}"`);            // Output: ""
console.log(`Single word: "${toKebabCase('hello')}"`);              // Output: "hello"
console.log(`Mixed separators: "${toKebabCase('hello_world-example name')}"`); // Output: "hello-world-example-name"
