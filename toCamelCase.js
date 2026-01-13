/**
 * Convert a string to camelCase.
 * Handles spaces, underscores, hyphens, and mixed casing.
 *
 * @param {string} str - The string to convert
 * @returns {string} - The camelCase version of the string
 *
 * Examples:
 * - "first name" → "firstName"
 * - "user_id" → "userId"
 * - "SCREEN_NAME" → "screenName"
 * - "mobile-number" → "mobileNumber"
 */
function toCamelCase(str) {
  if (!str || typeof str !== 'string') return '';

  return str
    .toLowerCase()
    .trim()
    .split(/[\s_\-]+/)                    // Split on spaces, underscores, hyphens
    .map((word, index) => {
      if (index === 0) return word;       // Keep first word lowercase
      return word.charAt(0).toUpperCase() + word.slice(1);  // Capitalize subsequent words
    })
    .join('');
}

module.exports = toCamelCase;

// Test cases
if (require.main === module) {
  const testCases = [
    ['first name', 'firstName'],
    ['user_id', 'userId'],
    ['SCREEN_NAME', 'screenName'],
    ['mobile-number', 'mobileNumber'],
    ['hello-world_example name', 'helloWorldExampleName'],
    ['', ''],
    ['singleword', 'singleword'],
  ];

  console.log('Testing toCamelCase:');
  testCases.forEach(([input, expected]) => {
    const result = toCamelCase(input);
    const status = result === expected ? '✓' : '✗';
    console.log(`${status} toCamelCase("${input}") = "${result}" (expected "${expected}")`);
  });
}
