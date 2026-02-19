# Utilities Documentation

This directory contains reusable utility functions and demonstrations of development methodology for the Anythink Market project.

## Directory Structure

```
utils/
├── chain_prompt.js          # Chain Prompt methodology demonstration
├── toKebabCase.js           # Kebab-case converter utility
├── toKebabCase.test.js      # Test suite for toKebabCase
└── README.md               # This file
```

## Available Utilities

### 1. toKebabCase

**Purpose:** Convert strings to kebab-case format (lowercase with hyphens).

**Location:** [toKebabCase.js](toKebabCase.js)

**Signature:**
```javascript
const toKebabCase = (str) => {
  // Returns: string | error_object
}
```

**Usage:**
```javascript
const toKebabCase = require('./toKebabCase');

// Valid input
const result = toKebabCase('Hello World');
console.log(result.result); // "hello-world"

// Invalid input
const error = toKebabCase(null);
console.log(error.message); // "Error: Input cannot be null or undefined"
```

**Features:**
- ✓ Converts to lowercase
- ✓ Replaces spaces with hyphens
- ✓ Handles multiple consecutive spaces
- ✓ Comprehensive error handling
- ✓ Returns structured response objects

**Error Codes:**
- `INVALID_NULL` - Input is null or undefined
- `INVALID_TYPE` - Input is not a string type
- `EMPTY_STRING` - Input is empty or whitespace-only

**Valid Cases:**
```javascript
toKebabCase('Hello World')           // {success: true, result: 'hello-world'}
toKebabCase('JavaScript Example')    // {success: true, result: 'javascript-example'}
toKebabCase('UPPERCASE')             // {success: true, result: 'uppercase'}
toKebabCase('Multiple   Spaces')     // {success: true, result: 'multiple-spaces'}
```

**Error Cases:**
```javascript
toKebabCase(null)        // {error: true, code: 'INVALID_NULL', ...}
toKebabCase(undefined)   // {error: true, code: 'INVALID_NULL', ...}
toKebabCase(123)         // {error: true, code: 'INVALID_TYPE', ...}
toKebabCase('')          // {error: true, code: 'EMPTY_STRING', ...}
toKebabCase('   ')       // {error: true, code: 'EMPTY_STRING', ...}
```

### 2. Chain Prompt Demonstration

**Purpose:** Show the complete Chain Prompt methodology with step-by-step progression.

**Location:** [chain_prompt.js](chain_prompt.js)

**Contains:**
- `toKebabCaseStep1` - Basic lowercase conversion
- `toKebabCaseStep2` - Space-to-hyphen replacement
- `toKebabCase` - Complete implementation with error handling

**Run Demo:**
```bash
node utils/chain_prompt.js
```

**Output:** Demonstrates all valid and invalid test cases with clear, formatted output.

## Development Methodology

All utilities in this directory follow the **Chain Prompt Methodology**:

### 3 Progressive Steps

1. **Step 1: Simple Foundation**
   - Basic functionality that's easy to understand
   - Minimal complexity
   - Single responsibility

2. **Step 2: Incremental Enhancement**
   - Builds on Step 1
   - Adds intermediate complexity
   - Extends functionality

3. **Step 3: Complete Integration**
   - Combines all steps
   - Adds error handling
   - Returns robust solution with structured responses

### Key Principles Applied

✓ **Clarity & Sequencing** - Each step follows logically
✓ **Incremental Complexity** - Gradual progression from simple to complex
✓ **Integration** - Steps combine into complete solution
✓ **Error Handling** - Comprehensive input validation
✓ **Testing** - Validated with diverse test cases

For more details, see [CONTRIBUTION_GUIDE.md](../CONTRIBUTION_GUIDE.md).

## Testing

### Unit Tests

Run the toKebabCase test suite:
```bash
node utils/toKebabCase.test.js
```

### Integration Tests

Run the chain prompt demonstration:
```bash
node utils/chain_prompt.js
```

### Test Coverage

The test suite validates:

**Valid Inputs:**
- Basic strings
- Strings with multiple spaces
- Uppercase/lowercase variations
- Mixed case strings

**Invalid Inputs:**
- Null values
- Undefined values
- Non-string types (numbers, objects, arrays)
- Empty strings
- Whitespace-only strings

## Adding New Utilities

When adding new utilities to this directory, follow the Chain Prompt pattern:

### Template

```javascript
/**
 * Utility Name and Description
 * 
 * Chain Prompt Steps:
 * Step 1: [Basic functionality]
 * Step 2: [Enhanced functionality]
 * Step 3: [Error handling and validation]
 */

// Step 1: Basic functionality
const myFunctionStep1 = (input) => {
  // Simple logic
};

// Step 2: Enhanced functionality
const myFunctionStep2 = (input) => {
  // Build on Step 1
};

// Step 3: Complete solution with error handling
const myFunction = (input) => {
  // Input validation
  if (/* invalid */) {
    return { error: true, message: '...', code: 'ERROR_CODE' };
  }
  
  // Core functionality (from Steps 1-2)
  return { success: true, result: /* result */ };
};

module.exports = myFunction;
```

### Test Template

```javascript
const myFunction = require('./myFunction');

console.log('=== Testing myFunction ===\n');

// Valid cases
console.log('Valid inputs:');
// ... tests

// Invalid cases
console.log('Invalid inputs:');
// ... error tests
```

## Performance Notes

- `toKebabCase`: O(n) time complexity, where n = string length
- All utilities are synchronous (no async operations)
- Suitable for both client and server-side use

## Dependencies

Current utilities have **zero external dependencies**:
- Pure JavaScript
- No npm packages required
- Compatible with Node.js 12+
- Browser compatible (when bundled)

## Best Practices

When using utilities from this directory:

1. **Always check for errors:**
   ```javascript
   const result = toKebabCase(input);
   if (result.error) {
     console.error(result.message);
   } else {
     console.log(result.result);
   }
   ```

2. **Use error codes for specific handling:**
   ```javascript
   if (result.error) {
     switch(result.code) {
       case 'INVALID_TYPE':
         // Handle type error
         break;
       case 'INVALID_NULL':
         // Handle null error
         break;
     }
   }
   ```

3. **Test edge cases:**
   - Empty strings
   - Whitespace
   - Special characters
   - Large inputs

## Contributing

To contribute utilities to this directory:

1. Follow the Chain Prompt methodology
2. Include 3+ progressive steps
3. Add comprehensive error handling
4. Create a test file (filename.test.js)
5. Document in this README
6. Create a PR with clear step descriptions

See [CONTRIBUTION_GUIDE.md](../CONTRIBUTION_GUIDE.md) for detailed guidelines.

## Questions?

- For usage questions: Check the specific utility documentation above
- For methodology questions: See [CONTRIBUTION_GUIDE.md](../CONTRIBUTION_GUIDE.md)
- For feature requests: Contact @vanessa-cooper

---

**Last Updated:** February 19, 2026
