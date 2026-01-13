// chain_prompt.js
// Exports a chain prompt for creating a `toKebabCase` function with sequential steps.

const toKebabCaseChainPrompt = `Let's create a JavaScript function called \`toKebabCase\` step by step.

Step 1: Define the purpose of the function.
The \`toKebabCase\` function should convert a string to kebab-case format. Words should be separated by hyphens, and all letters should be lowercase. The function should handle strings with spaces, underscores, camelCase, and mixed casing.

Step 2: Write the function logic.
The function should:
- Replace spaces, underscores, and dots with hyphens.
- Insert hyphens before uppercase letters in camelCase strings.
- Remove any non-alphanumeric characters except hyphens.
- Collapse multiple consecutive hyphens into a single hyphen.
- Trim leading and trailing hyphens.
- Convert the entire string to lowercase.

Step 3: Add error handling and examples.
The function should:
- Gracefully handle null, undefined, and non-string inputs by returning an empty string.
- Include inline comments explaining each step of the logic.
- Provide examples to demonstrate the function's behavior, such as:
  - Input: \`"first name"\` → Output: \`"first-name"\`
  - Input: \`"camelCaseExample"\` → Output: \`"camel-case-example"\`
  - Input: \`"CSS_CLASS_NAME"\` → Output: \`"css-class-name"\`
  - Input: \`null\` → Output: \`""\`

Now, implement the \`toKebabCase\` function based on these steps.`;

module.exports = { toKebabCaseChainPrompt };