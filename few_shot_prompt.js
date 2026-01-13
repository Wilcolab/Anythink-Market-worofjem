// few_shot_prompt.js
// Exports few-shot prompt templates with examples for improved output quality.

const fewShotPrompt = `You are a helpful assistant. Use the following examples to understand the desired output format and style.`;

const camelCaseFewShot = `Convert strings to camelCase format.

Examples:
- "hello world" → "helloWorld"
- "user_name" → "userName"
- "first-name-last-name" → "firstNameLastName"
- "HTTPSConnection" → "httpsConnection"

Now convert the following string:`;

const snakeCaseFewShot = `Convert strings to snake_case format.

Examples:
- "helloWorld" → "hello_world"
- "firstName" → "first_name"
- "HTTPSConnection" → "https_connection"
- "user name" → "user_name"

Now convert the following string:`;

function buildFewShotPrompt(examples = [], task = '') {
  const examplesText = examples.map((ex, i) => `${i + 1}. ${ex}`).join('\n');
  return `${fewShotPrompt}\n\nExamples:\n${examplesText}\n\n${task}`;
}

module.exports = { fewShotPrompt, camelCaseFewShot, snakeCaseFewShot, buildFewShotPrompt };
