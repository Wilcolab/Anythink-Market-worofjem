/**
 * Chain Prompt Template
 * 
 * A chain prompt breaks down complex tasks into sequential steps,
 * where each step builds on the previous one.
 * This is the foundation of the Chain Prompt Methodology.
 */

const chainPromptTemplate = {
  /**
   * Create a chain prompt with progressive steps
   * @param {string} goal - The overall goal
   * @param {Array} steps - Array of step descriptions
   * @returns {string} - Formatted chain prompt
   */
  create: function(goal, steps = []) {
    let prompt = `GOAL: ${goal}\n\n`;
    prompt += `EXECUTION STEPS:\n\n`;

    steps.forEach((step, index) => {
      prompt += `Step ${index + 1}: ${step.title}\n`;
      if (step.description) {
        prompt += `Description: ${step.description}\n`;
      }
      if (step.output) {
        prompt += `Expected Output: ${step.output}\n`;
      }
      prompt += '\n';
    });

    return prompt;
  },

  /**
   * Create from simple step titles
   * @param {string} goal - The goal
   * @param {Array} stepTitles - Array of step titles
   * @returns {string} - Formatted chain prompt
   */
  fromTitles: function(goal, stepTitles = []) {
    const steps = stepTitles.map(title => ({ title }));
    return this.create(goal, steps);
  },

  /**
   * Add step dependencies
   * @param {string} goal - The goal
   * @param {Array} steps - Steps with dependencies
   * @returns {string} - Chain prompt with dependencies
   */
  withDependencies: function(goal, steps = []) {
    let prompt = this.create(goal, steps);

    prompt += '\nDEPENCIES:\n';
    steps.forEach((step, index) => {
      if (step.dependsOn !== undefined) {
        prompt += `Step ${index + 1} depends on: Step ${step.dependsOn}\n`;
      }
    });

    return prompt;
  },

  /**
   * Create branching chain prompt
   * @param {string} goal - The goal
   * @param {Array} branches - Alternative paths/branches
   * @returns {string} - Chain prompt with branches
   */
  withBranches: function(goal, branches = []) {
    let prompt = `GOAL: ${goal}\n\n`;

    branches.forEach((branch, index) => {
      prompt += `BRANCH ${index + 1}: ${branch.name}\n`;
      prompt += `Steps:\n`;
      branch.steps.forEach((step, stepIndex) => {
        prompt += `  ${stepIndex + 1}. ${step}\n`;
      });
      prompt += '\n';
    });

    return prompt;
  }
};

module.exports = chainPromptTemplate;
