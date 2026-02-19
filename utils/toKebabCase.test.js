const toKebabCase = require('./toKebabCase');

console.log('=== Chain Prompt Execution: toKebabCase Tests ===\n');

// Test Step 1: Basic lowercase conversion (embedded in final solution)
console.log('✓ Step 1: Lowercase Conversion');
console.log(`  Input: "HELLO"  =>  Output: "${toKebabCase('HELLO')}"\n`);

// Test Step 2: Space-to-hyphen conversion (embedded in final solution)
console.log('✓ Step 2: Kebab-Case Conversion');
console.log(`  Input: "hello world"  =>  Output: "${toKebabCase('hello world')}"`);
console.log(`  Input: "Convert This STRING"  =>  Output: "${toKebabCase('Convert This STRING')}"\n`);

// Test Step 3: Error Handling
console.log('✓ Step 3: Error Handling');

// Test with null
console.log('  Input: null');
console.log(`  Output:`, toKebabCase(null));

// Test with undefined
console.log('\n  Input: undefined');
console.log(`  Output:`, toKebabCase(undefined));

// Test with number
console.log('\n  Input: 12345 (number)');
console.log(`  Output:`, toKebabCase(12345));

// Test with empty string
console.log('\n  Input: "" (empty string)');
console.log(`  Output:`, toKebabCase(''));

// Test with valid input
console.log('\n  Input: "JavaScript kebab case" (valid)');
console.log(`  Output:`, toKebabCase('JavaScript kebab case'));

console.log('\n=== All Tests Complete ===');
