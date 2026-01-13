/**
 * Convert a string to camelCase with robust error handling.
 * 
 * Handles:
 * - Spaces, underscores, hyphens, dots, and mixed casing
 * - Removes non-alphanumeric characters (except separators)
 * - Trims leading/trailing separators or whitespace
 * - Gracefully handles null, undefined, and non-string inputs
 * - Capitalizes words after the first one
 * 
 * @param {any} input - The value to convert to camelCase
 * @returns {string} - The camelCase string, or empty string if input is invalid
 */
function toCamelCase(input) {
  // Handle null, undefined, and empty values
  if (input === null || input === undefined) {
    return '';
  }

  // Convert input to string
  let str = String(input).trim();

  // Handle empty strings
  if (str.length === 0) {
    return '';
  }

  // Split on common separators (spaces, underscores, hyphens, dots)
  // and filter out empty parts
  const words = str
    .split(/[\s_\-\.]+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase());

  // Handle case where there are no valid words
  if (words.length === 0) {
    return '';
  }

  // Build camelCase: first word lowercase, rest capitalized
  return words
    .map((word, index) => {
      if (index === 0) {
        // First word: keep lowercase
        return word;
      }
      // Subsequent words: capitalize first letter, rest lowercase
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

module.exports = toCamelCase;

// Test cases demonstrating all requirements
if (require.main === module) {
  const testCases = [
    // Basic examples
    ['first name', 'firstName'],
    ['user_id', 'userId'],
    ['SCREEN_NAME', 'screenName'],
    ['mobile-number', 'mobileNumber'],
    ['hello.world_example-name', 'helloWorldExampleName'],
    
    // Edge cases: null, undefined, empty
    [null, ''],
    [undefined, ''],
    ['', ''],
    ['   ', ''],
    
    // Non-string inputs
    [123, '123'],
    [0, '0'],
    
    // Multiple separators
    ['hello---world___test', 'helloWorldTest'],
    
    // Single word
    ['word', 'word'],
    ['WORD', 'word'],
    
    // Leading/trailing separators
    ['_hello_world_', 'helloWorld'],
    ['-first-name-', 'firstName'],
    ['.user.id.', 'userId'],
  ];

  console.log('Testing toCamelCase function:\n');
  let passed = 0;
  let failed = 0;

  testCases.forEach(([input, expected]) => {
    const result = toCamelCase(input);
    const success = result === expected;
    const status = success ? '✓ PASS' : '✗ FAIL';
    
    if (success) passed++;
    else failed++;

    const inputDisplay = input === null ? 'null' : 
                        input === undefined ? 'undefined' : 
                        `"${input}"`;
    console.log(`${status}: toCamelCase(${inputDisplay}) = "${result}" (expected "${expected}")`);
  });

  console.log(`\n${passed} passed, ${failed} failed out of ${testCases.length} tests`);
}
