/**
 * STEP 1: Define the function's purpose
 * 
 * The `toKebabCase` function converts a string to kebab-case format.
 * Kebab-case is commonly used for:
 * - CSS class names (e.g., "main-container")
 * - HTML attributes (e.g., "data-user-id")
 * - URL slugs (e.g., "my-blog-post")
 * 
 * Words are separated by hyphens and all letters are lowercase.
 * The function handles various input formats including camelCase, snake_case,
 * spaces, and mixed casing.
 */

/**
 * STEP 2: Write the function logic with specific requirements
 * 
 * Convert a string to kebab-case format.
 * 
 * @param {any} input - The value to convert to kebab-case
 * @returns {string} The kebab-case string, or empty string if input is invalid
 */
function toKebabCase(input) {
  // STEP 3: Add error handling
  // Handle null and undefined gracefully
  if (input === null || input === undefined) {
    return '';
  }

  // Convert non-string inputs to string
  let str = String(input).trim();

  // Handle empty strings after trimming
  if (str.length === 0) {
    return '';
  }

  // Processing logic:
  
  // 1. Insert hyphens before uppercase letters in camelCase strings
  //    (e.g., "camelCase" → "camel-Case")
  str = str.replace(/([a-z0-9])([A-Z])/g, '$1-$2');

  // 2. Replace spaces, underscores, and dots with hyphens
  str = str.replace(/[\s_\.]+/g, '-');

  // 3. Remove any non-alphanumeric characters except hyphens
  //    This ensures only valid characters remain
  str = str.replace(/[^A-Za-z0-9\-]/g, '');

  // 4. Collapse multiple consecutive hyphens into a single hyphen
  //    (e.g., "hello---world" → "hello-world")
  str = str.replace(/\-+/g, '-');

  // 5. Trim leading and trailing hyphens
  str = str.replace(/^\-+|\-+$/g, '');

  // 6. Convert the entire string to lowercase
  return str.toLowerCase();
}

module.exports = toKebabCase;

// STEP 3: Examples demonstrating the function's behavior
if (require.main === module) {
  console.log('Testing toKebabCase function:\n');
  
  // Example 1: Space-separated words
  console.log('Example 1: Space-separated words');
  console.log('Input:  "first name"');
  console.log('Output:', toKebabCase('first name'));
  console.log('Expected: "first-name"\n');

  // Example 2: camelCase conversion
  console.log('Example 2: camelCase conversion');
  console.log('Input:  "camelCaseExample"');
  console.log('Output:', toKebabCase('camelCaseExample'));
  console.log('Expected: "camel-case-example"\n');

  // Example 3: SCREAMING_SNAKE_CASE conversion
  console.log('Example 3: SCREAMING_SNAKE_CASE conversion');
  console.log('Input:  "CSS_CLASS_NAME"');
  console.log('Output:', toKebabCase('CSS_CLASS_NAME'));
  console.log('Expected: "css-class-name"\n');

  // Example 4: Mixed separators
  console.log('Example 4: Mixed separators');
  console.log('Input:  "hello world_example-test"');
  console.log('Output:', toKebabCase('hello world_example-test'));
  console.log('Expected: "hello-world-example-test"\n');

  // Example 5: Null handling
  console.log('Example 5: Null handling');
  console.log('Input:  null');
  console.log('Output:', toKebabCase(null));
  console.log('Expected: ""\n');

  // Example 6: Number input
  console.log('Example 6: Number input');
  console.log('Input:  123');
  console.log('Output:', toKebabCase(123));
  console.log('Expected: "123"\n');

  // Comprehensive test suite
  console.log('\n--- Running Test Suite ---\n');
  
  const testCases = [
    ['first name', 'first-name'],
    ['camelCaseExample', 'camel-case-example'],
    ['CSS_CLASS_NAME', 'css-class-name'],
    ['mobile-number', 'mobile-number'],
    ['HTTPSConnection', 'https-connection'],
    ['hello world_example-test', 'hello-world-example-test'],
    [null, ''],
    [undefined, ''],
    ['', ''],
    [123, '123'],
    ['  leading-trailing  ', 'leading-trailing'],
    ['multiple---hyphens', 'multiple-hyphens'],
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach(([input, expected]) => {
    const result = toKebabCase(input);
    const success = result === expected;
    const status = success ? '✓ PASS' : '✗ FAIL';
    
    if (success) passed++;
    else failed++;

    const inputDisplay = input === null ? 'null' : 
                        input === undefined ? 'undefined' : 
                        `"${input}"`;
    console.log(`${status}: toKebabCase(${inputDisplay}) = "${result}" (expected "${expected}")`);
  });

  console.log(`\n${passed} passed, ${failed} failed out of ${testCases.length} tests`);
}
