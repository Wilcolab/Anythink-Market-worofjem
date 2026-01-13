// refined_prompt.js
// Exports refined, detailed prompts with comprehensive requirements and edge cases.

const robustCamelCasePrompt = `Write a JavaScript function \`toCamelCase\` that converts a string to camelCase. The function should handle the following:

1. Strings with spaces, underscores, hyphens, dots, and mixed casing.
2. Remove any non-alphanumeric characters except separators.
3. Trim leading and trailing separators or whitespace.
4. Handle empty strings, \`null\`, \`undefined\`, and non-string inputs gracefully.
5. Ensure the first word is lowercase, and subsequent words are capitalized.

Examples:
- Input: \`"first name"\` → Output: \`"firstName"\`
- Input: \`"user_id"\` → Output: \`"userId"\`
- Input: \`"SCREEN_NAME"\` → Output: \`"screenName"\`
- Input: \`"mobile-number"\` → Output: \`"mobileNumber"\`
- Input: \`"hello.world_example-name"\` → Output: \`"helloWorldExampleName"\`
- Input: \`null\` → Output: \`""\`
- Input: \`123\` → Output: \`"123"\`

Include error handling and comments explaining the logic.`;

const robustSnakeCasePrompt = `Write a JavaScript function \`toSnakeCase\` that converts a string to snake_case. The function should:

1. Handle camelCase, spaces, hyphens, dots, and mixed casing.
2. Remove or replace special characters intelligently.
3. Collapse multiple separators into a single underscore.
4. Trim leading and trailing underscores.
5. Handle edge cases: null, undefined, non-string inputs, empty strings.

Examples:
- Input: \`"helloWorld"\` → Output: \`"hello_world"\`
- Input: \`"firstName"\` → Output: \`"first_name"\`
- Input: \`"HTTPSConnection"\` → Output: \`"https_connection"\`
- Input: \`"user name"\` → Output: \`"user_name"\`
- Input: \`null\` → Output: \`""\`

Include error handling and comments.`;

function buildRefinedPrompt(requirements = [], examples = []) {
  let prompt = 'Write a function with the following requirements:\n\n';
  
  if (requirements.length > 0) {
    prompt += 'Requirements:\n';
    requirements.forEach((req, i) => {
      prompt += `${i + 1}. ${req}\n`;
    });
  }
  
  if (examples.length > 0) {
    prompt += '\nExamples:\n';
    examples.forEach(ex => {
      prompt += `- ${ex}\n`;
    });
  }
  
  return prompt;
}

module.exports = { robustCamelCasePrompt, robustSnakeCasePrompt, buildRefinedPrompt };
