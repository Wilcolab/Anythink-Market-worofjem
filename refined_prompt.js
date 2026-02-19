/**
 * Refined Prompt Template
 * 
 * A refined prompt builds on basic and few-shot approaches,
 * adding refinement through iterative improvement and detailed instructions.
 */

const refinedPromptTemplate = {
  /**
   * Create a refined prompt with multiple components
   * @param {Object} config - Configuration object
   * @returns {string} - Formatted refined prompt
   */
  create: function(config = {}) {
    const {
      objective = '',
      context = '',
      examples = [],
      constraints = [],
      format = '',
      tone = 'professional'
    } = config;

    let prompt = '';

    if (objective) {
      prompt += `OBJECTIVE:\n${objective}\n\n`;
    }

    if (context) {
      prompt += `CONTEXT:\n${context}\n\n`;
    }

    if (examples.length > 0) {
      prompt += `EXAMPLES:\n`;
      examples.forEach((example, index) => {
        prompt += `\n${index + 1}. Input: ${example.input}\n`;
        prompt += `   Output: ${example.output}\n`;
      });
      prompt += '\n';
    }

    if (constraints.length > 0) {
      prompt += `CONSTRAINTS:\n`;
      constraints.forEach((constraint) => {
        prompt += `- ${constraint}\n`;
      });
      prompt += '\n';
    }

    if (format) {
      prompt += `RESPONSE FORMAT:\n${format}\n\n`;
    }

    prompt += `TONE: ${tone}\n`;

    return prompt;
  },

  /**
   * Add refinement iterations
   * @param {string} basePrompt - The initial prompt
   * @param {Array} refinements - List of refinements to apply
   * @returns {string} - Refined prompt
   */
  refine: function(basePrompt, refinements = []) {
    let refined = basePrompt;

    refinements.forEach((refinement) => {
      refined += `\n\nREFINEMENT: ${refinement}`;
    });

    return refined;
  },

  /**
   * Create iterative improvement prompt
   * @param {string} task - Initial task
   * @param {Array} feedback - Previous feedback
   * @returns {string} - Refined prompt based on feedback
   */
  iterative: function(task, feedback = []) {
    let prompt = `Task: ${task}\n\n`;

    if (feedback.length > 0) {
      prompt += `Previous Feedback:\n`;
      feedback.forEach((item, index) => {
        prompt += `${index + 1}. ${item}\n`;
      });
      prompt += '\nPlease address the above feedback in your response.\n';
    }

    return prompt;
  }
};

module.exports = refinedPromptTemplate;
