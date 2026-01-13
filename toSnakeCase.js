/**
 * Converts text to snake_case format
 * @param {string} text - The text to convert
 * @returns {string} - The text converted to snake_case
 */
function toSnakeCase(text) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore before uppercase letters
    .replace(/[\s\-]+/g, '_')              // Replace spaces and hyphens with underscores
    .toLowerCase();                         // Convert to lowercase
}

module.exports = toSnakeCase;

// Example usage:
console.log(toSnakeCase('helloWorld'));           // Output: hello_world
console.log(toSnakeCase('Hello World'));          // Output: hello_world
console.log(toSnakeCase('hello-world'));          // Output: hello_world
console.log(toSnakeCase('HelloWorldExample'));    // Output: hello_world_example
