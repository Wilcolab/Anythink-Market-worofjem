/**
 * Validation Utilities Collection
 * 
 * Common validation functions for user input, configuration, and data integrity.
 * Each validator follows the Chain Prompt methodology with progressive steps.
 */

/**
 * VALIDATOR 1: validateEmail
 * Comprehensive email validation
 * 
 * Step 1: Basic format with regex
 * Step 2: Check domain structure
 * Step 3: Error handling with specific codes
 */
const validateEmail = (email) => {
  if (email === null || email === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Email cannot be null or undefined'
    };
  }
  
  if (typeof email !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof email}`
    };
  }
  
  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Email cannot be empty'
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      error: true,
      code: 'INVALID_FORMAT',
      message: 'Email format is invalid (must be user@domain.extension)'
    };
  }
  
  const [localPart, domain] = trimmed.split('@');
  
  if (localPart.length > 64) {
    return {
      error: true,
      code: 'LOCAL_PART_TOO_LONG',
      message: 'Email local part exceeds 64 characters'
    };
  }
  
  if (domain.length > 255) {
    return {
      error: true,
      code: 'DOMAIN_TOO_LONG',
      message: 'Email domain exceeds 255 characters'
    };
  }
  
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return {
      error: true,
      code: 'INVALID_DOMAIN',
      message: 'Email domain must have at least one dot'
    };
  }
  
  const extension = domainParts[domainParts.length - 1];
  if (extension.length < 2 || extension.length > 6) {
    return {
      error: true,
      code: 'INVALID_EXTENSION',
      message: 'Email extension must be 2-6 characters'
    };
  }
  
  return {
    success: true,
    email: trimmed,
    localPart: localPart,
    domain: domain,
    isValid: true
  };
};

/**
 * VALIDATOR 2: validatePassword
 * Strong password validation with configurable rules
 * 
 * Step 1: Basic length check
 * Step 2: Character complexity requirements
 * Step 3: Error handling with detailed feedback
 */
const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true
  } = options;
  
  if (password === null || password === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Password cannot be null or undefined'
    };
  }
  
  if (typeof password !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof password}`
    };
  }
  
  if (password.length < minLength) {
    return {
      error: true,
      code: 'TOO_SHORT',
      message: `Password must be at least ${minLength} characters long`
    };
  }
  
  if (password.length > maxLength) {
    return {
      error: true,
      code: 'TOO_LONG',
      message: `Password must not exceed ${maxLength} characters`
    };
  }
  
  const issues = [];
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    issues.push('lowercase letter');
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    issues.push('number');
  }
  
  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('special character');
  }
  
  if (issues.length > 0) {
    return {
      error: true,
      code: 'MISSING_REQUIREMENTS',
      message: `Password must contain: ${issues.join(', ')}`,
      requirements: issues
    };
  }
  
  return {
    success: true,
    strength: calculatePasswordStrength(password),
    isValid: true
  };
};

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  const levels = ['very weak', 'weak', 'fair', 'good', 'strong', 'very strong'];
  return levels[strength] || 'very weak';
};

/**
 * VALIDATOR 3: validateUsername
 * Username validation with specific rules
 * 
 * Step 1: Basic format and length
 * Step 2: Character allowance
 * Step 3: Error handling and metadata
 */
const validateUsername = (username, options = {}) => {
  const {
    minLength = 3,
    maxLength = 30,
    allowSpaces = false,
    allowSpecialChars = false
  } = options;
  
  if (username === null || username === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Username cannot be null or undefined'
    };
  }
  
  if (typeof username !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof username}`
    };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Username cannot be empty'
    };
  }
  
  if (trimmed.length < minLength) {
    return {
      error: true,
      code: 'TOO_SHORT',
      message: `Username must be at least ${minLength} characters`
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      error: true,
      code: 'TOO_LONG',
      message: `Username must not exceed ${maxLength} characters`
    };
  }
  
  if (!allowSpaces && /\s/.test(trimmed)) {
    return {
      error: true,
      code: 'CONTAINS_SPACES',
      message: 'Username cannot contain spaces'
    };
  }
  
  if (!allowSpecialChars && !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      error: true,
      code: 'INVALID_CHARACTERS',
      message: 'Username can only contain letters, numbers, hyphens, and underscores'
    };
  }
  
  if (/^[_-]/.test(trimmed) || /[_-]$/.test(trimmed)) {
    return {
      error: true,
      code: 'INVALID_START_END',
      message: 'Username cannot start or end with underscore or hyphen'
    };
  }
  
  return {
    success: true,
    username: trimmed,
    length: trimmed.length,
    isValid: true
  };
};

/**
 * VALIDATOR 4: validatePhone
 * Phone number validation
 * 
 * Step 1: Basic format check
 * Step 2: Digit extraction and validation
 * Step 3: Error handling with formatting
 */
const validatePhone = (phone) => {
  if (phone === null || phone === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Phone number cannot be null or undefined'
    };
  }
  
  if (typeof phone !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof phone}`
    };
  }
  
  const trimmed = phone.trim();
  
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'Phone number cannot be empty'
    };
  }
  
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return {
      error: true,
      code: 'TOO_SHORT',
      message: 'Phone number must contain at least 10 digits'
    };
  }
  
  if (digitsOnly.length > 15) {
    return {
      error: true,
      code: 'TOO_LONG',
      message: 'Phone number must not exceed 15 digits'
    };
  }
  
  return {
    success: true,
    phone: trimmed,
    digitsOnly: digitsOnly,
    length: digitsOnly.length,
    formatted: formatPhone(digitsOnly),
    isValid: true
  };
};

const formatPhone = (digits) => {
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
};

/**
 * VALIDATOR 5: validateURL
 * URL validation
 * 
 * Step 1: Basic URL format
 * Step 2: Protocol and domain validation
 * Step 3: Error handling with parsing
 */
const validateURL = (url) => {
  if (url === null || url === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'URL cannot be null or undefined'
    };
  }
  
  if (typeof url !== 'string') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected string, received ${typeof url}`
    };
  }
  
  const trimmed = url.trim();
  
  if (trimmed.length === 0) {
    return {
      error: true,
      code: 'EMPTY_STRING',
      message: 'URL cannot be empty'
    };
  }
  
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  if (!urlRegex.test(trimmed)) {
    return {
      error: true,
      code: 'INVALID_FORMAT',
      message: 'URL format is invalid'
    };
  }
  
  try {
    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    
    return {
      success: true,
      url: trimmed,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      pathname: urlObj.pathname,
      isValid: true
    };
  } catch (error) {
    return {
      error: true,
      code: 'PARSE_ERROR',
      message: 'URL could not be parsed'
    };
  }
};

/**
 * VALIDATOR 6: validateNumber
 * Number validation with range checking
 * 
 * Step 1: Type and format validation
 * Step 2: Range checking
 * Step 3: Error handling with metadata
 */
const validateNumber = (number, options = {}) => {
  const {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    allowFloat = true,
    allowNegative = true
  } = options;
  
  if (number === null || number === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Number cannot be null or undefined'
    };
  }
  
  const numValue = Number(number);
  
  if (isNaN(numValue)) {
    return {
      error: true,
      code: 'NOT_A_NUMBER',
      message: `"${number}" is not a valid number`
    };
  }
  
  if (!allowFloat && !Number.isInteger(numValue)) {
    return {
      error: true,
      code: 'NOT_INTEGER',
      message: 'Number must be an integer'
    };
  }
  
  if (!allowNegative && numValue < 0) {
    return {
      error: true,
      code: 'NEGATIVE_NOT_ALLOWED',
      message: 'Number cannot be negative'
    };
  }
  
  if (numValue < min) {
    return {
      error: true,
      code: 'BELOW_MINIMUM',
      message: `Number must be at least ${min}`
    };
  }
  
  if (numValue > max) {
    return {
      error: true,
      code: 'ABOVE_MAXIMUM',
      message: `Number must not exceed ${max}`
    };
  }
  
  return {
    success: true,
    value: numValue,
    isInteger: Number.isInteger(numValue),
    isValid: true
  };
};

// Export all validators
module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateURL,
  validateNumber
};
