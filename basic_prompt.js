/**
 * Basic Prompt Template
 * 
 * A basic prompt structure for working with AI assistance.
 * Demonstrates fundamental prompt engineering principles.
 */

const basicPromptTemplate = {
  /**
   * Simple task definition
   * @param {string} task - The task description
   * @param {string} context - Additional context
   * @returns {string} - Formatted prompt
   */
  create: function(task, context = '') {
    return `
Task: ${task}

${context ? `Context:\n${context}\n` : ''}

Please provide a clear and concise response.
    `.trim();
  },

  /**
   * Task with examples
   * @param {string} task - The task description
   * @param {Array} examples - Array of example inputs/outputs
   * @returns {string} - Formatted prompt with examples
   */
  withExamples: function(task, examples = []) {
    let prompt = `Task: ${task}\n\n`;
    
    if (examples.length > 0) {
      prompt += 'Examples:\n';
      examples.forEach((example, index) => {
        prompt += `\n${index + 1}. Input: ${example.input}\n`;
        prompt += `   Output: ${example.output}\n`;
      });
    }
    
    return prompt;
  },

  /**
   * Task with constraints
   * @param {string} task - The task description
   * @param {Array} constraints - List of constraints
   * @returns {string} - Formatted prompt with constraints
   */
  withConstraints: function(task, constraints = []) {
    let prompt = `Task: ${task}\n\n`;
    
    if (constraints.length > 0) {
      prompt += 'Constraints:\n';
      constraints.forEach((constraint, index) => {
        prompt += `- ${constraint}\n`;
      });
    }
    
    return prompt;
  }
};

module.exports = basicPromptTemplate;
