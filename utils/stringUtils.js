/**
 * String Utilities Collection
 * 
 * A collection of string transformation utilities following the Chain Prompt methodology.
 * Each utility demonstrates progression from basic to advanced functionality.
 */

/**
 * UTILITY 1: trimAndValidate
 * Validates and trims strings with progressive error handling
 * 
 * Step 1: Basic string trimming
 * Step 2: Add type checking
 * Step 3: Add comprehensive validation and structured responses
 */
const trimAndValidate = (input, options = {}) => {
  // Step 1: Basic trim (embedded)
  // Step 2: Type check (embedded)
  
  // Step 3: Complete validation
  const { minLength = 1, maxLength = 1000, allowEmpty = false } = options;
  
  // Type validation
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
  
  // Trim the string (Step 1)
  const trimmed = input.trim();
  
  // Empty check
  if (trimmed.length === 0) {
    if (!allowEmpty) {
      return {
        error: true,
        code: 'EMPTY_STRING',
        message: 'String cannot be empty'
      };
    }
    return { success: true, result: trimmed, wasEmpty: true };
  }
  
  // Length validation (Step 2 extended)
  if (trimmed.length < minLength) {
    return {
      error: true,
      code: 'TOO_SHORT',
      message: `String length must be at least ${minLength} characters`
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      error: true,
      code: 'TOO_LONG',
      message: `String length must not exceed ${maxLength} characters`
    };
  }
  
  return {
    success: true,
    result: trimmed,
    originalLength: input.length,
    trimmedLength: trimmed.length,
    charsRemoved: input.length - trimmed.length
  };
};

/**
 * UTILITY 2: toCamelCase
 * Convert strings to camelCase format with validation
 * 
 * Step 1: Basic uppercase conversion
 * Step 2: Add word separation handling
 * Step 3: Add validation and error handling
 */
const toCamelCase = (input) => {
  // Validate input
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
  
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Input cannot be empty'
    };
  }
  
  // Step 1: Convert to lowercase (baseline)
  // Step 2: Split by spaces, hyphens, underscores
  const words = trimmed.split(/[\s\-_]+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return {
      error: true,
      code: 'NO_WORDS',
      message: 'No valid words found in input'
    };
  }
  
  // Step 3: Build camelCase with validation
  const camelCased = words
    .map((word, index) => {
      const lowercase = word.toLowerCase();
      // First word stays lowercase, rest capitalize first letter
      if (index === 0) return lowercase;
      return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    })
    .join('');
  
  return {
    success: true,
    result: camelCased,
    wordCount: words.length,
    originalInput: input
  };
};

/**
 * UTILITY 3: toPascalCase
 * Convert strings to PascalCase format
 * Similar to camelCase but first letter is capitalized
 * 
 * Step 1: Basic word splitting
 * Step 2: Capitalize all words
 * Step 3: Add validation and error handling
 */
const toPascalCase = (input) => {
  // Validate input (Step 3 - Error Handling)
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
  
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Input cannot be empty'
    };
  }
  
  // Step 1: Split into words
  // Step 2: Capitalize each word
  const words = trimmed.split(/[\s\-_]+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return {
      error: true,
      code: 'NO_WORDS',
      message: 'No valid words found in input'
    };
  }
  
  const pascalCased = words
    .map(word => {
      const lowercase = word.toLowerCase();
      return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    })
    .join('');
  
  return {
    success: true,
    result: pascalCased,
    wordCount: words.length,
    originalInput: input
  };
};

/**
 * UTILITY 4: truncate
 * Truncate strings to max length with optional ellipsis
 * 
 * Step 1: Basic string length limiting
 * Step 2: Add ellipsis and word boundary detection
 * Step 3: Add validation and smart truncation options
 */
const truncate = (input, maxLength = 50, options = {}) => {
  const { ellipsis = '...', wordBoundary = true } = options;
  
  // Step 3: Complete validation
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
  
  if (maxLength < 1) {
    return {
      error: true,
      code: 'INVALID_LENGTH',
      message: 'maxLength must be at least 1'
    };
  }
  
  const trimmed = input.trim();
  
  // Step 1: Basic truncation
  if (trimmed.length <= maxLength) {
    return {
      success: true,
      result: trimmed,
      wasTruncated: false,
      originalLength: trimmed.length
    };
  }
  
  // Step 2: Smart truncation with word boundary
  let truncated = trimmed.substring(0, maxLength - ellipsis.length);
  
  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength / 2) {
      truncated = truncated.substring(0, lastSpace);
    }
  }
  
  const result = truncated + ellipsis;
  
  return {
    success: true,
    result: result,
    wasTruncated: true,
    originalLength: trimmed.length,
    truncatedLength: result.length,
    charsRemoved: trimmed.length - result.length
  };
};

/**
 * UTILITY 5: parseCSV (simple)
 * Parse comma-separated strings into arrays
 * 
 * Step 1: Basic split and trim
 * Step 2: Remove empty values
 * Step 3: Add validation and filtering options
 */
const parseCSV = (input, options = {}) => {
  const { allowEmpty = false, filter = null } = options;
  
  // Step 3: Validation
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
  
  // Step 1: Split by comma
  // Step 2: Trim each value
  let values = input.split(',').map(val => val.trim());
  
  // Remove empty values unless allowed
  if (!allowEmpty) {
    values = values.filter(val => val.length > 0);
  }
  
  // Apply custom filter if provided
  if (filter && typeof filter === 'function') {
    values = values.filter(filter);
  }
  
  if (values.length === 0) {
    return {
      error: true,
      code: 'NO_VALUES',
      message: 'No valid values found in CSV string'
    };
  }
  
  return {
    success: true,
    result: values,
    count: values.length,
    originalInput: input
  };
};

/**
 * UTILITY 6: reverseString
 * Reverse a string with validation
 * 
 * Step 1: Basic string reversal
 * Step 2: Handle special characters
 * Step 3: Add validation and metrics
 */
const reverseString = (input) => {
  // Step 3: Validation
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
  
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Input cannot be empty'
    };
  }
  
  // Step 1: Basic reversal
  const reversed = trimmed.split('').reverse().join('');
  
  // Step 2: Additional check for palindromes
  const isPalindrome = trimmed.toLowerCase() === reversed.toLowerCase();
  
  return {
    success: true,
    result: reversed,
    originalLength: trimmed.length,
    isPalindrome: isPalindrome,
    originalInput: input
  };
};

// Export all utilities
module.exports = {
  trimAndValidate,
  toCamelCase,
  toPascalCase,
  truncate,
  parseCSV,
  reverseString
};
