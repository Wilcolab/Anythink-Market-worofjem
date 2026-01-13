// basic_prompt.js
// Exports a simple base prompt string and a helper to build prompts with context.

const basicPrompt = 'You are a helpful, concise assistant. Provide clear, actionable answers and code examples when relevant.';

function buildPrompt(context = '') {
  return context ? `${basicPrompt}\n\nContext:\n${context}` : basicPrompt;
}

module.exports = { basicPrompt, buildPrompt };
