/**
 * Few-Shot Prompt Template
 * 
 * A few-shot prompt provides a few examples to guide the AI's response.
 * Typically includes 2-5 examples to establish a pattern.
 */

const fewShotPromptTemplate = {
  /**
   * Create a few-shot prompt with examples
   * @param {string} task - The task description
   * @param {Array} examples - Array of example pairs
   * @param {string} newInput - The new input to solve
   * @returns {string} - Formatted few-shot prompt
   */
  create: function(task, examples = [], newInput = '') {
    let prompt = `Task: ${task}\n\n`;
    
    if (examples.length > 0) {
      prompt += 'Examples:\n\n';
      examples.forEach((example, index) => {
        prompt += `Example ${index + 1}:\n`;
        prompt += `Input: ${example.input}\n`;
        prompt += `Output: ${example.output}\n\n`;
      });
    }
    
    if (newInput) {
      prompt += `Now apply the pattern to:\nInput: ${newInput}\nOutput: `;
    }
    
    return prompt;
  },

  /**
   * Create from input-output pairs
   * @param {string} task - Task description
   * @param {Array} pairs - Array of {input, output} pairs
   * @returns {string} - Formatted prompt
   */
  fromPairs: function(task, pairs = []) {
    let prompt = `${task}\n\n`;
    
    pairs.forEach((pair, index) => {
      prompt += `${index + 1}. ${pair.input} → ${pair.output}\n`;
    });
    
    return prompt;
  },

  /**
   * Few-shot with step-by-step explanation
   * @param {string} task - Task description
   * @param {Array} examples - Examples with explanations
   * @returns {string} - Detailed prompt
   */
  withExplanations: function(task, examples = []) {
    let prompt = `Task: ${task}\n\n`;
    
    examples.forEach((example, index) => {
      prompt += `Example ${index + 1}:\n`;
      prompt += `Input: ${example.input}\n`;
      prompt += `Steps:\n`;
      if (example.steps && Array.isArray(example.steps)) {
        example.steps.forEach((step, stepIndex) => {
          prompt += `  ${stepIndex + 1}. ${step}\n`;
        });
      }
      prompt += `Output: ${example.output}\n\n`;
    });
    
    return prompt;
  }
};

module.exports = fewShotPromptTemplate;
