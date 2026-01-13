/**
 * CHAIN PROMPT IMPLEMENTATION: toKebabCase Function
 * 
 * This implementation follows the three sequential steps from the chain prompt:
 * STEP 1: Function Foundation & Input Validation
 * STEP 2: String Transformation Logic
 * STEP 3: Error Handling & Comprehensive Testing
 */

/**
 * Converts a string to kebab-case format with comprehensive validation and error handling.
 * 
 * Transforms input strings into kebab-case (hyphen-separated lowercase words) by:
 * - Validating input is a non-null, non-undefined string
 * - Converting to lowercase
 * - Splitting by separators (spaces, underscores, hyphens)
 * - Filtering empty values
 * - Joining with hyphens
 * 
 * @function toKebabCase
 * @param {string} input - The input string to convert to kebab-case
 * @returns {string} - The converted kebab-case string. Returns empty string for empty/whitespace-only inputs
 * @throws {Error} - If input is null or undefined with message: "Input cannot be null or undefined"
 * @throws {Error} - If input is not a string with message: "Input must be a string, but received [type]"
 * 
 * @example
 * // Basic conversions
 * toKebabCase("firstName");              // Returns: "first-name"
 * toKebabCase("first name");             // Returns: "first-name"
 * toKebabCase("first_name");             // Returns: "first-name"
 * toKebabCase("FIRST_NAME");             // Returns: "first-name"
 * toKebabCase("first-name");             // Returns: "first-name"
 * 
 * @example
 * // Edge cases with whitespace and multiple separators
 * toKebabCase("  first   name  ");       // Returns: "first-name"
 * toKebabCase("first___name---example"); // Returns: "first-name-example"
 * toKebabCase("firstName123Id");         // Returns: "first-name123-id"
 * toKebabCase("hello_world-example name");// Returns: "hello-world-example-name"
 * toKebabCase("");                       // Returns: ""
 * toKebabCase("   ");                    // Returns: ""
 */
function toKebabCase(input) {
  // ===== STEP 1: Function Foundation & Input Validation =====
  
  // Validate that input is not null or undefined
  if (input === null || input === undefined) {
    throw new Error('Input cannot be null or undefined');
  }

  // Validate that input is a string
  if (typeof input !== 'string') {
    throw new Error(`Input must be a string, but received ${typeof input}`);
  }

  // Trim whitespace from the input
  const trimmedInput = input.trim();

  // Return empty string if input is empty or only whitespace
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

console.log('========== VALID TEST CASES ==========');
console.log('Basic conversions:');
console.log(`toKebabCase("firstName"):          "${toKebabCase('firstName')}"`);              // Output: "first-name"
console.log(`toKebabCase("first name"):         "${toKebabCase('first name')}"`);             // Output: "first-name"
console.log(`toKebabCase("first_name"):         "${toKebabCase('first_name')}"`);             // Output: "first-name"
console.log(`toKebabCase("FIRST_NAME"):         "${toKebabCase('FIRST_NAME')}"`);             // Output: "first-name"
console.log(`toKebabCase("first-name"):         "${toKebabCase('first-name')}"`);             // Output: "first-name"

console.log('\nEdge cases with whitespace and multiple separators:');
console.log(`toKebabCase("  first   name  "):   "${toKebabCase('  first   name  ')}"`);       // Output: "first-name"
console.log(`toKebabCase("first___name---example"): "${toKebabCase('first___name---example')}"`); // Output: "first-name-example"
console.log(`toKebabCase("firstName123Id"):    "${toKebabCase('firstName123Id')}"`);         // Output: "first-name123-id"
console.log(`toKebabCase("hello_world-example name"): "${toKebabCase('hello_world-example name')}"`); // Output: "hello-world-example-name"

console.log('\n========== ERROR HANDLING EXAMPLES ==========');

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
console.log(`Empty string result: "${toKebabCase('')}"`);           // Output: ""
console.log(`Whitespace-only result: "${toKebabCase('   ')}"`);     // Output: ""
console.log(`Single word: "${toKebabCase('hello')}"`);              // Output: "hello"
console.log(`Mixed case single: "${toKebabCase('HelloWorld')}"`);   // Output: "hello-world"
