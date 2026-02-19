/**
 * Basic Prompt Template
 * 
 * A basic prompt structure for working with AI assistance.
 * Demonstrates fundamental prompt engineering principles.
 * 
 * Can be used standalone or chained for building complex prompts.
 */

const BasicPromptBuilder = function(task, context = '') {
  this.task = task;
  this.context = context;
  this.examples = [];
  this.constraints = [];
};

/**
 * Add examples to the prompt
 * @param {Array} exampleList - Array of example inputs/outputs
 * @returns {BasicPromptBuilder} - Returns this for chaining
 */
BasicPromptBuilder.prototype.withExamples = function(exampleList = []) {
  this.examples = exampleList;
  return this;
};

/**
 * Add constraints to the prompt
 * @param {Array} constraintList - List of constraints
 * @returns {BasicPromptBuilder} - Returns this for chaining
 */
BasicPromptBuilder.prototype.withConstraints = function(constraintList = []) {
  this.constraints = constraintList;
  return this;
};

/**
 * Build and return the final prompt string
 * @returns {string} - Formatted prompt
 */
BasicPromptBuilder.prototype.build = function() {
  let prompt = `Task: ${this.task}\n\n`;
  
  if (this.context) {
    prompt += `Context:\n${this.context}\n\n`;
  }
  
  if (this.examples.length > 0) {
    prompt += 'Examples:\n';
    this.examples.forEach((example, index) => {
      prompt += `\n${index + 1}. Input: ${example.input}\n`;
      prompt += `   Output: ${example.output}\n`;
    });
    prompt += '\n';
  }
  
  if (this.constraints.length > 0) {
    prompt += 'Constraints:\n';
    this.constraints.forEach((constraint) => {
      prompt += `- ${constraint}\n`;
    });
    prompt += '\n';
  }
  
  prompt += 'Please provide a clear and concise response.';
  return prompt.trim();
};

const basicPromptTemplate = {
  /**
   * Simple task definition - returns chainable builder
   * @param {string} task - The task description
   * @param {string} context - Additional context
   * @returns {BasicPromptBuilder} - Chainable builder object
   */
  create: function(task, context = '') {
    return new BasicPromptBuilder(task, context);
  },

  /**
   * Direct creation with examples (non-chainable)
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
   * Direct creation with constraints (non-chainable)
   * @param {string} task - The task description
   * @param {Array} constraints - List of constraints
   * @returns {string} - Formatted prompt with constraints
   */
  withConstraints: function(task, constraints = []) {
    let prompt = `Task: ${task}\n\n`;
    
    if (constraints.length > 0) {
      prompt += 'Constraints:\n';
      constraints.forEach((constraint) => {
        prompt += `- ${constraint}\n`;
      });
    }
    
    return prompt;
  }
};

module.exports = basicPromptTemplate;
