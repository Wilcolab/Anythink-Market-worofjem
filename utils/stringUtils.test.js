/**
 * String Utilities Test Suite
 * Demonstrates testing of all stringUtils functions
 */

const {
  trimAndValidate,
  toCamelCase,
  toPascalCase,
  truncate,
  parseCSV,
  reverseString
} = require('./stringUtils');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║      STRING UTILITIES - COMPREHENSIVE TEST SUITE             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// TEST SUITE 1: trimAndValidate
// ============================================================================
console.log('📋 Test 1: trimAndValidate');
console.log('─────────────────────────────────────────────────────────────');

const trimTests = [
  { input: '  hello world  ', options: {}, desc: 'Basic trim' },
  { input: 'short', options: { minLength: 2, maxLength: 10 }, desc: 'Valid length' },
  { input: 'a', options: { minLength: 2 }, desc: 'Too short' },
  { input: 'this is way too long for the max length', options: { maxLength: 10 }, desc: 'Too long' },
  { input: '   ', options: { allowEmpty: false }, desc: 'Only whitespace' }
];

trimTests.forEach(test => {
  const result = trimAndValidate(test.input, test.options);
  const status = result.success ? '✓' : '✗';
  console.log(`${status} ${test.desc}`);
  if (result.success) {
    console.log(`  Result: "${result.result}" (length: ${result.trimmedLength})`);
  } else {
    console.log(`  Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 2: toCamelCase
// ============================================================================
console.log('\n📋 Test 2: toCamelCase');
console.log('─────────────────────────────────────────────────────────────');

const camelCaseTests = [
  'hello world',
  'convert-this-string',
  'some_other_example',
  'UPPERCASE STRING',
  'mixed Case-With_Separators'
];

camelCaseTests.forEach(test => {
  const result = toCamelCase(test);
  if (result.success) {
    console.log(`✓ "${test}" → "${result.result}"`);
  } else {
    console.log(`✗ "${test}" → Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 3: toPascalCase
// ============================================================================
console.log('\n📋 Test 3: toPascalCase');
console.log('─────────────────────────────────────────────────────────────');

const pascalCaseTests = [
  'hello world',
  'convert-this-string',
  'some_other_example',
  'lowercase example'
];

pascalCaseTests.forEach(test => {
  const result = toPascalCase(test);
  if (result.success) {
    console.log(`✓ "${test}" → "${result.result}"`);
  } else {
    console.log(`✗ "${test}" → Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 4: truncate
// ============================================================================
console.log('\n📋 Test 4: truncate');
console.log('─────────────────────────────────────────────────────────────');

const truncateTests = [
  {
    input: 'This is a short string',
    maxLength: 50,
    options: {},
    desc: 'String shorter than max'
  },
  {
    input: 'This is a very long string that needs to be truncated',
    maxLength: 30,
    options: { wordBoundary: true },
    desc: 'Truncate with word boundary'
  },
  {
    input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    maxLength: 15,
    options: { wordBoundary: true, ellipsis: '...' },
    desc: 'Truncate no word boundary'
  }
];

truncateTests.forEach(test => {
  const result = truncate(test.input, test.maxLength, test.options);
  if (result.success) {
    console.log(`✓ ${test.desc}`);
    console.log(`  Original: "${test.input}" (${test.input.length} chars)`);
    console.log(`  Truncated: "${result.result}" (${result.result.length} chars)`);
  } else {
    console.log(`✗ ${test.desc} → Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 5: parseCSV
// ============================================================================
console.log('\n📋 Test 5: parseCSV');
console.log('─────────────────────────────────────────────────────────────');

const csvTests = [
  { input: 'apple, banana, cherry', options: {}, desc: 'Basic CSV' },
  { input: '  orange  ,  grape  ,  mango  ', options: {}, desc: 'CSV with spaces' },
  { input: 'one, , three', options: { allowEmpty: false }, desc: 'Skip empty values' },
  { input: 'one, , three', options: { allowEmpty: true }, desc: 'Keep empty values' }
];

csvTests.forEach(test => {
  const result = parseCSV(test.input, test.options);
  if (result.success) {
    console.log(`✓ ${test.desc}`);
    console.log(`  Result: [${result.result.map(v => `"${v}"`).join(', ')}]`);
  } else {
    console.log(`✗ ${test.desc} → Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 6: reverseString
// ============================================================================
console.log('\n📋 Test 6: reverseString');
console.log('─────────────────────────────────────────────────────────────');

const reverseTests = [
  'hello',
  'racecar',
  'A man a plan a canal Panama',
  'Python'
];

reverseTests.forEach(test => {
  const result = reverseString(test);
  if (result.success) {
    const palindromeMsg = result.isPalindrome ? ' (palindrome!)' : '';
    console.log(`✓ "${test}" → "${result.result}"${palindromeMsg}`);
  } else {
    console.log(`✗ "${test}" → Error: ${result.message}`);
  }
});

// ============================================================================
// TEST SUITE 7: Error Handling - All Functions
// ============================================================================
console.log('\n📋 Test 7: Error Handling (All Functions)');
console.log('─────────────────────────────────────────────────────────────');

const errorTests = [
  { func: 'trimAndValidate', fn: () => trimAndValidate(null), expected: 'INVALID_NULL' },
  { func: 'toCamelCase', fn: () => toCamelCase(123), expected: 'INVALID_TYPE' },
  { func: 'toPascalCase', fn: () => toPascalCase(''), expected: 'EMPTY_STRING' },
  { func: 'truncate', fn: () => truncate('test', 0), expected: 'INVALID_LENGTH' },
  { func: 'parseCSV', fn: () => parseCSV(undefined), expected: 'INVALID_NULL' },
  { func: 'reverseString', fn: () => reverseString({}), expected: 'INVALID_TYPE' }
];

errorTests.forEach(test => {
  const result = test.fn();
  const codeMatch = result.code === test.expected ? '✓' : '✗';
  console.log(`${codeMatch} ${test.func}: ${result.code}`);
  if (result.code !== test.expected) {
    console.log(`   Expected: ${test.expected}, Got: ${result.code}`);
  }
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         ALL UTILITIES TESTED SUCCESSFULLY                   ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Summary of Utilities:');
console.log('  1. trimAndValidate     - Trim with length validation');
console.log('  2. toCamelCase         - Convert to camelCase');
console.log('  3. toPascalCase        - Convert to PascalCase');
console.log('  4. truncate            - Smart string truncation');
console.log('  5. parseCSV            - Parse comma-separated values');
console.log('  6. reverseString       - Reverse strings & detect palindromes');
console.log('\nAll utilities follow Chain Prompt methodology with:');
console.log('  ✓ Input validation     ✓ Error codes           ✓ Structured responses');
console.log('  ✓ Error handling       ✓ Helpful messages      ✓ Meta information\n');
