/**
 * Converts a string to dot.case format with comprehensive validation and error handling.
 * @param {string} input - The input string to convert to dot.case
 * @returns {string} - The converted dot.case string
 * @throws {Error} - If input is null, undefined, or not a string
 * @example
 * convertToDotCase("first name"); // Returns "first.name"
 * convertToDotCase("user_id"); // Returns "user.id"
 * convertToDotCase("SCREEN_NAME"); // Returns "screen.name"
 */
function convertToDotCase(input) {
  // Input Validation: Check for null or undefined
  if (input === null || input === undefined) {
    throw new Error('Input cannot be null or undefined');
  }

  // Input Validation: Check if input is a string
  if (typeof input !== 'string') {
    throw new Error(`Input must be a string, but received ${typeof input}`);
  }

  // Handle empty or whitespace-only inputs
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    return '';
  }

  // Convert to dot.case
  return trimmedInput
    .toLowerCase() // Case-insensitive input handling
    .split(/[\s_\-]+/) // Split by spaces, underscores, or hyphens (handles multiple consecutive separators)
    .filter(word => word.length > 0) // Filter out empty values from splits
    .join('.'); // Join with dots
}

module.exports = convertToDotCase;

// ===== TEST CASES =====
console.log('=== Valid Examples ===');
console.log(convertToDotCase('first name')); // Output: first.name
console.log(convertToDotCase('user_id')); // Output: user.id
console.log(convertToDotCase('SCREEN_NAME')); // Output: screen.name
console.log(convertToDotCase('mobile-number')); // Output: mobile.number
console.log(convertToDotCase('  hello   world  ')); // Output: hello.world
console.log(convertToDotCase('user_123_id')); // Output: user.123.id
console.log(convertToDotCase('hello___world---test')); // Output: hello.world.test
console.log(convertToDotCase('hello_world-example name')); // Output: hello.world.example.name

console.log('\n=== Error Handling Examples ===');

// Error handling for null input
try {
  convertToDotCase(null);
} catch (error) {
  console.error('❌ Error (null input):', error.message);
}

// Error handling for undefined input
try {
  convertToDotCase(undefined);
} catch (error) {
  console.error('❌ Error (undefined input):', error.message);
}

// Error handling for number input
try {
  convertToDotCase(123);
} catch (error) {
  console.error('❌ Error (number input):', error.message);
}

// Error handling for object input
try {
  convertToDotCase({});
} catch (error) {
  console.error('❌ Error (object input):', error.message);
}

// Error handling for array input
try {
  convertToDotCase(['hello', 'world']);
} catch (error) {
  console.error('❌ Error (array input):', error.message);
}

// Valid edge case: empty string
console.log('\n=== Edge Cases ===');
console.log(`Empty string result: "${convertToDotCase('')}"`); // Output: ""
console.log(`Whitespace-only result: "${convertToDotCase('   ')}"`); // Output: ""
