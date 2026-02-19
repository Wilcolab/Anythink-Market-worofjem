/**
 * CHAIN PROMPT: Kebab-Case Converter
 * 
 * This file demonstrates a structured, step-by-step chain prompt approach:
 * 
 * 1. Start with a simple task that is easy to understand and execute
 *    Create a basic JavaScript function called toKebabCase that converts a string to lowercase.
 * 
 * 2. Gradually introduce more complexity
 *    Modify the function to replace spaces between words with hyphens, enabling a conversion to kebab-case.
 * 
 * 3. Integrate all modifications into a coherent program
 *    Enhance the function with error handling to ensure it returns an error message when the input is not a valid string.
 */

// ============================================================================
// STEP 1: Basic Function - Lowercase Conversion
// ============================================================================
// Start simple: Convert input string to lowercase
const toKebabCaseStep1 = (str) => {
  return str.toLowerCase();
};

// Example Step 1:
// Input: "HELLO WORLD"
// Output: "hello world"
// ✓ Clarity: Simple operation that anyone can understand


// ============================================================================
// STEP 2: Incremental Complexity - Add Space-to-Hyphen Replacement
// ============================================================================
// Build on Step 1: Now replace spaces with hyphens for kebab-case format
const toKebabCaseStep2 = (str) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};

// Example Step 2:
// Input: "Hello World Example"
// Output: "hello-world-example"
// ✓ Incremental: Uses the lowercase from Step 1, adds hyphen replacement
// ✓ Sequencing: Logically follows from Step 1


// ============================================================================
// STEP 3: Integration & Error Handling - Complete Solution
// ============================================================================
// Final step: Validate inputs and handle errors comprehensively
const toKebabCase = (str) => {
  // Validate input is not null or undefined
  if (str === null || str === undefined) {
    return {
      error: true,
      message: 'Error: Input cannot be null or undefined',
      code: 'INVALID_NULL'
    };
  }

  // Validate input is a string type
  if (typeof str !== 'string') {
    return {
      error: true,
      message: `Error: Input must be a string, received ${typeof str}`,
      code: 'INVALID_TYPE'
    };
  }

  // Validate string is not empty
  if (str.trim().length === 0) {
    return {
      error: true,
      message: 'Error: Input cannot be an empty string',
      code: 'EMPTY_STRING'
    };
  }

  // ✓ Integration: Combines all previous steps
  // Step 1 (lowercase) + Step 2 (space replacement) + Step 3 (validation)
  return {
    success: true,
    result: str.toLowerCase().replace(/\s+/g, '-'),
    originalInput: str
  };
};

// ============================================================================
// TESTING & DEMONSTRATION
// ============================================================================

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  CHAIN PROMPT DEMONSTRATION: toKebabCase Converter          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Test Group 1: Valid Inputs
console.log('📋 Test Group 1: Valid String Inputs');
console.log('─────────────────────────────────────────────────────────────');

const validTestCases = [
  'Hello World',
  'JavaScript kebab case',
  'Convert   Multiple   Spaces',
  'UPPERCASE STRING',
  'Single word'
];

validTestCases.forEach(testCase => {
  const result = toKebabCase(testCase);
  console.log(`✓ Input:  "${testCase}"`);
  console.log(`  Output: "${result.result}"\n`);
});

// Test Group 2: Invalid Inputs (Error Handling)
console.log('⚠️  Test Group 2: Invalid Inputs - Error Handling');
console.log('─────────────────────────────────────────────────────────────');

const invalidTestCases = [
  { input: null, description: 'null value' },
  { input: undefined, description: 'undefined value' },
  { input: 12345, description: 'number type' },
  { input: { name: 'test' }, description: 'object type' },
  { input: [], description: 'array type' },
  { input: '', description: 'empty string' },
  { input: '   ', description: 'whitespace only' }
];

invalidTestCases.forEach(testCase => {
  const result = toKebabCase(testCase.input);
  console.log(`✗ Input:  ${testCase.description}`);
  console.log(`  Error:  ${result.message}`);
  console.log(`  Code:   ${result.code}\n`);
});

// ============================================================================
// KEY PRINCIPLES DEMONSTRATED
// ============================================================================

console.log('📚 Key Principles Demonstrated:');
console.log('─────────────────────────────────────────────────────────────');
console.log('1. ✓ Clarity & Sequencing');
console.log('   Each step builds logically on the previous one\n');
console.log('2. ✓ Incremental Complexity');
console.log('   Started simple (lowercase) → Added features (hyphen) → Complete solution\n');
console.log('3. ✓ Integration');
console.log('   Final solution combines all previous modifications\n');
console.log('4. ✓ Error Handling');
console.log('   Validates input type, content, and nullability\n');
console.log('5. ✓ Testing');
console.log('   Demonstrates functionality with various test cases\n');

module.exports = { toKebabCase, toKebabCaseStep1, toKebabCaseStep2 };
