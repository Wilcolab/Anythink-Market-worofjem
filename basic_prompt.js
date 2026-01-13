// Create a function that converts strings to camelCase format.
// The function should handle strings with spaces, hyphens, and underscores.
// Example: convertToCamelCase('hello world') should return 'helloWorld'
// Example: convertToCamelCase('hello-world') should return 'helloWorld'
// Example: convertToCamelCase('hello_world') should return 'helloWorld'

function convertToCamelCase(text) {
  return text
    .split(/[\s\-_]+/)
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

module.exports = convertToCamelCase;

// Example usage:
console.log(convertToCamelCase('hello world'));      // Output: helloWorld
console.log(convertToCamelCase('hello-world'));      // Output: helloWorld
console.log(convertToCamelCase('hello_world'));      // Output: helloWorld
console.log(convertToCamelCase('hello WORLD'));      // Output: helloWorld
console.log(convertToCamelCase('hello_world_example')); // Output: helloWorldExample
