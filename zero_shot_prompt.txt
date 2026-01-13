/**
 * Convert a string to snake_case.
 * - Handles camelCase, spaces, hyphens, dots, and punctuation.
 * - Collapses multiple separators and trims leading/trailing underscores.
 *
 * @param {any} input
 * @returns {string}
 */
function toSnakeCase(input) {
  if (input === null || input === undefined) return '';
  const text = String(input).trim();
  if (text.length === 0) return '';

  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')    // camelCase -> camel_Case
    .replace(/[\s\-\.\u2013\u2014]+/g, '_') // spaces, hyphens, dots, dashes -> _
    .replace(/[^A-Za-z0-9_]+/g, '')            // remove other punctuation
    .replace(/__+/g, '_')                      // collapse duplicate _
    .replace(/^_+|_+$/g, '')                   // trim leading/trailing _
    .toLowerCase();
}

module.exports = toSnakeCase;

// Example:
// const toSnakeCase = require('./toSnakeCase');
// console.log(toSnakeCase('Hello WorldExample-123!')); // hello_world_example_123
