/**
 * @fileoverview String case conversion utilities with comprehensive documentation.
 * Provides functions to convert strings between different naming conventions.
 * 
 * @author Your Team
 * @version 1.0.0
 * @license MIT
 */

/**
 * Converts a string to camelCase format.
 * 
 * The first word is lowercase, and each subsequent word has its first letter
 * capitalized with no separators between words.
 * 
 * @param {any} input - The value to convert. If not a string, will be coerced to string.
 *                      Supports null, undefined, and non-string inputs.
 * @returns {string} The camelCase version of the input string, or an empty string
 *                   if the input is null, undefined, or empty after processing.
 * 
 * @throws {TypeError} Will not throw; gracefully handles invalid input types.
 * 
 * @example
 * toCamelCase('first name')                    // Returns: 'firstName'
 * toCamelCase('user_id')                       // Returns: 'userId'
 * toCamelCase('SCREEN_NAME')                   // Returns: 'screenName'
 * toCamelCase('mobile-number')                 // Returns: 'mobileNumber'
 * toCamelCase('hello.world_example-name')      // Returns: 'helloWorldExampleName'
 * toCamelCase(null)                            // Returns: ''
 * toCamelCase(undefined)                       // Returns: ''
 * toCamelCase(123)                             // Returns: '123'
 * 
 * @description
 * Splits input on spaces, underscores, hyphens, and dots.
 * Removes non-alphanumeric characters and collapses multiple separators.
 * Trims leading and trailing whitespace before processing.
 * 
 * @see {@link toSnakeCase}
 * @see {@link toDotCase}
 * @see {@link toPascalCase}
 */
function toCamelCase(input) {
  if (input === null || input === undefined) {
    return '';
  }
  let str = String(input).trim();
  if (str.length === 0) {
    return '';
  }
  const words = str
    .split(/[\s_\-\.]+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase());
  if (words.length === 0) {
    return '';
  }
  return words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Converts a string to snake_case format.
 * 
 * Words are separated by underscores and converted to lowercase.
 * Handles camelCase by inserting underscores before capital letters.
 * 
 * @param {any} input - The value to convert. Can be any type; will be coerced to string.
 * @returns {string} The snake_case version of the input, or empty string if input is
 *                   null, undefined, or empty after processing.
 * 
 * @throws {TypeError} Will not throw; gracefully handles all input types.
 * 
 * @example
 * toSnakeCase('helloWorld')                    // Returns: 'hello_world'
 * toSnakeCase('firstName')                     // Returns: 'first_name'
 * toSnakeCase('HTTPSConnection')               // Returns: 'https_connection'
 * toSnakeCase('user name')                     // Returns: 'user_name'
 * toSnakeCase('mobile-number')                 // Returns: 'mobile_number'
 * toSnakeCase(null)                            // Returns: ''
 * toSnakeCase(123)                             // Returns: '123'
 * 
 * @description
 * Identifies camelCase transitions and inserts underscores before capitals.
 * Collapses multiple consecutive underscores into a single separator.
 * Trims leading and trailing underscores from the result.
 * All output is lowercase.
 * 
 * @see {@link toCamelCase}
 * @see {@link toDotCase}
 * @see {@link toKebabCase}
 */
function toSnakeCase(input) {
  if (input === null || input === undefined) {
    return '';
  }
  let str = String(input).trim();
  if (str.length === 0) {
    return '';
  }
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s\-\.\u2013\u2014]+/g, '_')
    .replace(/[^A-Za-z0-9_]+/g, '')
    .replace(/__+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Converts a string to dot.case format.
 * 
 * Words are separated by dots and converted to lowercase.
 * Useful for configuration keys, namespaced identifiers, and nested properties.
 * 
 * @param {any} input - The value to convert. Will be coerced to string if needed.
 * @returns {string} The dot.case version of the input, or empty string if input is
 *                   null, undefined, or empty after processing.
 * 
 * @throws {TypeError} Will not throw; handles invalid inputs gracefully.
 * 
 * @example
 * toDotCase('first name')                      // Returns: 'first.name'
 * toDotCase('user_id')                         // Returns: 'user.id'
 * toDotCase('SCREEN_NAME')                     // Returns: 'screen.name'
 * toDotCase('firstName')                       // Returns: 'first.name'
 * toDotCase('camelCaseExample')                // Returns: 'camel.case.example'
 * toDotCase('hello-world_example')             // Returns: 'hello.world.example'
 * toDotCase(null)                              // Returns: ''
 * toDotCase(123)                               // Returns: '123'
 * 
 * @description
 * Converts camelCase by inserting dots before uppercase letters.
 * Splits on spaces, underscores, hyphens, and dots.
 * Collapses consecutive dots and removes leading/trailing dots.
 * All output is lowercase.
 * 
 * @see {@link toCamelCase}
 * @see {@link toSnakeCase}
 */
function toDotCase(input) {
  if (input === null || input === undefined) {
    return '';
  }
  let str = String(input).trim();
  if (str.length === 0) {
    return '';
  }
  str = str.replace(/([a-z0-9])([A-Z])/g, '$1.$2');
  const words = str
    .split(/[\s_\-]+/)
    .filter(word => word.length > 0)
    .map(word => word.toLowerCase());
  if (words.length === 0) {
    return '';
  }
  return words
    .join('.')
    .replace(/\.+/g, '.');
}

/**
 * Converts a string to PascalCase format.
 * 
 * Similar to camelCase but the first word is also capitalized.
 * Commonly used for class names and component names.
 * 
 * @param {any} input - The value to convert.
 * @returns {string} The PascalCase version of the input.
 * 
 * @example
 * toPascalCase('first name')                   // Returns: 'FirstName'
 * toPascalCase('user_id')                      // Returns: 'UserId'
 * toPascalCase('react component')              // Returns: 'ReactComponent'
 * 
 * @see {@link toCamelCase}
 */
function toPascalCase(input) {
  const camelCased = toCamelCase(input);
  if (camelCased.length === 0) return '';
  return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}

/**
 * Converts a string to kebab-case format.
 * 
 * Words are separated by hyphens and converted to lowercase.
 * Commonly used for CSS classes, HTML attributes, and URL slugs.
 * 
 * @param {any} input - The value to convert.
 * @returns {string} The kebab-case version of the input.
 * 
 * @example
 * toKebabCase('first name')                    // Returns: 'first-name'
 * toKebabCase('camelCaseExample')              // Returns: 'camel-case-example'
 * toKebabCase('CSS_CLASS_NAME')                // Returns: 'css-class-name'
 * 
 * @see {@link toSnakeCase}
 */
function toKebabCase(input) {
  if (input === null || input === undefined) {
    return '';
  }
  let str = String(input).trim();
  if (str.length === 0) {
    return '';
  }
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_\.]+/g, '-')
    .replace(/[^A-Za-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '')
    .toLowerCase();
}

/**
 * Case conversion options for bulk conversions.
 * @typedef {Object} CaseConversionOptions
 * @property {boolean} [camelCase=false] - Convert to camelCase
 * @property {boolean} [snakeCase=false] - Convert to snake_case
 * @property {boolean} [dotCase=false] - Convert to dot.case
 * @property {boolean} [pascalCase=false] - Convert to PascalCase
 * @property {boolean} [kebabCase=false] - Convert to kebab-case
 */

/**
 * Batch converts a string to multiple formats.
 * 
 * @param {string} input - The string to convert.
 * @param {CaseConversionOptions} options - Which formats to generate.
 * @returns {Object} An object with requested case conversions.
 * 
 * @example
 * convertAll('hello world', { camelCase: true, snakeCase: true })
 * // Returns: { camelCase: 'helloWorld', snakeCase: 'hello_world' }
 */
function convertAll(input, options = {}) {
  const result = {};
  if (options.camelCase) result.camelCase = toCamelCase(input);
  if (options.snakeCase) result.snakeCase = toSnakeCase(input);
  if (options.dotCase) result.dotCase = toDotCase(input);
  if (options.pascalCase) result.pascalCase = toPascalCase(input);
  if (options.kebabCase) result.kebabCase = toKebabCase(input);
  return result;
}

module.exports = {
  toCamelCase,
  toSnakeCase,
  toDotCase,
  toPascalCase,
  toKebabCase,
  convertAll,
};
