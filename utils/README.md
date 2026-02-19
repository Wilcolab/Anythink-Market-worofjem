# Utilities Documentation

This directory contains reusable utility functions and demonstrations of development methodology for the Anythink Market project.

## Directory Structure

```
utils/
├── stringUtils.js         # String manipulation utilities
├── stringUtils.test.js    # String utilities test suite
├── validators.js          # Input validation utilities
└── README.md             # This file
```

## Available Utilities

### 1. String Utilities (stringUtils.js)

**6 String Manipulation Functions**

- `trimAndValidate` - Trim with configurable length validation
- `toCamelCase` - Convert strings to camelCase
- `toPascalCase` - Convert strings to PascalCase
- `truncate` - Smart string truncation with word boundaries
- `parseCSV` - Parse comma-separated values
- `reverseString` - Reverse strings and detect palindromes

**Usage:**
```javascript
const { toCamelCase } = require('./stringUtils');

const result = toCamelCase('hello world');
console.log(result.result); // "helloWorld"
```

**Features:**
- ✓ Input type validation
- ✓ Structured error responses
- ✓ Error codes for categorization
- ✓ Helpful error messages
- ✓ Metadata in responses

### 2. Validators (validators.js)

**6 Validation Functions**

- `validateEmail` - Email validation with domain structure checks
- `validatePassword` - Strong password validation with configurable rules
- `validateUsername` - Username pattern and length validation
- `validatePhone` - Phone number validation with formatting
- `validateURL` - URL parsing and structure validation
- `validateNumber` - Number type and range validation

**Usage:**
```javascript
const { validateEmail } = require('./validators');

const result = validateEmail('user@example.com');
if (result.success) {
  console.log('Valid email:', result.email);
} else {
  console.log('Error:', result.message);
}
```

**Features:**
- ✓ Step-by-step implementation
- ✓ Specific error codes
- ✓ Helpful error messages
- ✓ Metadata and formatting info
- ✓ Configurable validation rules

## Testing

### Run String Utils Tests
```bash
node utils/stringUtils.test.js
```

### Run Validators
Create your own test file:
```javascript
const { validateEmail } = require('./validators');
console.log(validateEmail('test@example.com'));
```

## Development Methodology

All utilities follow the **Chain Prompt Methodology** with:

### 3 Progressive Steps

1. **Step 1: Simple Foundation**
   - Basic functionality
   - Easy to understand
   - Minimal complexity

2. **Step 2: Incremental Enhancement**
   - Builds on Step 1
   - Extends functionality
   - Intermediate complexity

3. **Step 3: Complete Integration**
   - All steps combined
   - Error handling added
   - Structured responses

### Key Principles Applied

✓ **Clarity & Sequencing** - Logical step progression
✓ **Incremental Complexity** - Gradual progression
✓ **Integration** - Steps combine into solution
✓ **Error Handling** - Comprehensive validation
✓ **Testing** - Valid and invalid cases

## Adding New Utilities

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

const myFunction = (input) => {
  // Step 3: Error handling
  if (input === null || input === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Input cannot be null or undefined'
    };
  }
  
  if (typeof input !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof input}`
    };
  }
  
  // Step 1 & 2: Core logic
  const result = performLogic(input);
  
  return {
    success: true,
    result: result
  };
};

module.exports = myFunction;
```

## Performance Notes

- All utilities: O(n) time complexity where n = input size
- All utilities: Synchronous (no async operations)
- Suitable for both client and server-side use

## Dependencies

**Zero external dependencies**
- Pure JavaScript
- No npm packages required
- Compatible with Node.js 12+
- Browser compatible (when bundled)

## Error Handling Pattern

All utilities return structured responses:

**Success:**
```javascript
{
  success: true,
  result: /* result */,
  metadata: { /* additional info */ }
}
```

**Error:**
```javascript
{
  error: true,
  code: 'ERROR_CODE',
  message: 'Helpful error message'
}
```

## Contributing

When adding utilities:

1. Follow Chain Prompt methodology (3+ steps)
2. Include comprehensive error handling
3. Create test file (filename.test.js)
4. Document in this README
5. Ensure zero external dependencies
6. Test with valid and invalid inputs

---

**Last Updated:** February 19, 2026
