/**
 * Convert a string to dot.case format.
 * 
 * Handles:
 * - Spaces, underscores, hyphens, and mixed casing
 * - Removes non-alphanumeric characters (except separators)
 * - Trims leading/trailing separators
 * - Gracefully handles null, undefined, and non-string inputs
 * - Collapses multiple separators into a single dot
 * 
 * @param {any} input - The value to convert to dot.case
 * @returns {string} - The dot.case string, or empty string if input is invalid
 */
function toDotCase(input) {
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

  // Convert camelCase to dot.case by inserting dots before capitals
  str = str.replace(/([a-z0-9])([A-Z])/g, '$1.$2');

  // Split on common separators (spaces, underscores, hyphens)
  // and filter out empty parts
  const words = str
    .split(/[\s_\-]+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase());

  // Handle case where there are no valid words
  if (words.length === 0) {
    return '';
  }

  // Join with dots and handle any consecutive dots
  return words
    .join('.')
    .replace(/\.+/g, '.');  // Collapse multiple dots
}

module.exports = toDotCase;

// Test cases demonstrating all functionality
if (require.main === module) {
  const testCases = [
    // Basic examples
    ['first name', 'first.name'],
    ['user_id', 'user.id'],
    ['SCREEN_NAME', 'screen.name'],
    ['mobile-number', 'mobile.number'],
    ['hello world_example-name', 'hello.world.example.name'],
    
    // CamelCase to dot.case
    ['firstName', 'first.name'],
    ['camelCaseExample', 'camel.case.example'],
    ['HTTPSConnection', 'h.t.t.p.s.connection'],
    
    // Edge cases: null, undefined, empty
    [null, ''],
    [undefined, ''],
    ['', ''],
    ['   ', ''],
    
    // Non-string inputs
    [123, '123'],
    [0, '0'],
    
    // Multiple separators
    ['hello---world___test', 'hello.world.test'],
    
    // Single word
    ['word', 'word'],
    ['WORD', 'word'],
    
    // Leading/trailing separators
    ['_hello_world_', 'hello.world'],
    ['-first-name-', 'first.name'],
    ['.user.id.', 'user.id'],
  ];

  console.log('Testing toDotCase function:\n');
  let passed = 0;
  let failed = 0;

  testCases.forEach(([input, expected]) => {
    const result = toDotCase(input);
    const success = result === expected;
    const status = success ? '✓ PASS' : '✗ FAIL';
    
    if (success) passed++;
    else failed++;

    const inputDisplay = input === null ? 'null' : 
                        input === undefined ? 'undefined' : 
                        `"${input}"`;
    console.log(`${status}: toDotCase(${inputDisplay}) = "${result}" (expected "${expected}")`);
  });

  console.log(`\n${passed} passed, ${failed} failed out of ${testCases.length} tests`);
}
