# Implementation Guide - Complete Code Examples

**Guide Version:** 1.0  
**Last Updated:** February 19, 2026

This guide provides complete, working code examples for every template and integration scenario. Copy-paste ready implementations for common tasks.

---

## 📚 Table of Contents

1. [Module Imports & Setup](#module-imports--setup)
2. [Level 1: Zero-Shot Examples](#level-1-zero-shot-examples)
3. [Level 2: Basic Prompt Examples](#level-2-basic-prompt-examples)
4. [Level 3: Few-Shot Examples](#level-3-few-shot-examples)
5. [Level 4: Refined Prompt Examples](#level-4-refined-prompt-examples)
6. [Level 5: Chain Prompt Examples](#level-5-chain-prompt-examples)
7. [Integration Patterns](#integration-patterns)
8. [Complete Workflow Scenarios](#complete-workflow-scenarios)
9. [Testing & Validation](#testing--validation)

---

## Module Imports & Setup

### Node.js Standard Setup

```javascript
// Require all templates
const basicPrompt = require('./basic_prompt.js');
const fewShotPrompt = require('./few_shot_prompt.js');
const refinedPrompt = require('./refined_prompt.js');
const chainPrompt = require('./chain_prompt.js');

// Create a prompt helper class
class PromptBuilder {
  constructor(level = 1) {
    this.level = level;
    this.content = '';
  }

  zero_shot(task, instructions) {
    return `Task: ${task}\n\n${instructions}`;
  }

  basic(task, context) {
    return basicPrompt.create(task, context);
  }

  fewShot(task, examples, input) {
    return fewShotPrompt.create(task, examples, input);
  }

  refined(config) {
    return refinedPrompt.create(config);
  }

  chain(goal, steps) {
    return chainPrompt.create(goal, steps);
  }
}

module.exports = PromptBuilder;
```

---

## Level 1: Zero-Shot Examples

### Example 1.1: Simple Question

```javascript
// File: zero_shot_examples.js

const task = `
Task: What is machine learning?

Instructions:
- Provide a concise definition (2-3 sentences)
- Include one practical example
- Keep it beginner-friendly
`;

console.log(task);
// Output: Ready to send to AI
```

### Example 1.2: Zero-Shot with Context

```javascript
const task = `
Task: Analyze the provided code and identify bugs

Code:
function getUserData(id) {
  const user = users[id];
  const data = processUser(user);
  return data;
}

Instructions:
- List any potential bugs
- Suggest fixes
- Explain the risks
`;

// This doesn't include examples, just clear instructions
```

### Example 1.3: Zero-Shot for Well-Known Tasks

```javascript
const translation_task = `
Task: Translate "Hello, how are you?" to Spanish

Provide:
- Direct translation
- Formal variant
- Colloquial variant
`;

// Works great for straightforward tasks that AI already understands well
```

---

## Level 2: Basic Prompt Examples

### Example 2.1: Create Basic Prompt

```javascript
const basicPrompt = require('./basic_prompt.js');

// Simple prompt creation
const prompt = basicPrompt.create(
  'Summarize the benefits of cloud computing',
  'Focus on cost savings and scalability'
);

console.log(prompt);
// Output:
// Task: Summarize the benefits of cloud computing
// 
// Context:
// Focus on cost savings and scalability
// 
// Please provide a clear and concise response.
```

### Example 2.2: Basic Prompt with Examples

```javascript
const basicPrompt = require('./basic_prompt.js');

const prompt = basicPrompt.withExamples(
  'Convert measurement units',
  [
    { input: '1 mile', output: '1.6 kilometers' },
    { input: '100 pounds', output: '45.4 kilograms' },
    { input: '32 Fahrenheit', output: '0 Celsius' }
  ]
);

console.log(prompt);
// Output shows task and examples
```

### Example 2.3: Basic Prompt with Constraints

```javascript
const basicPrompt = require('./basic_prompt.js');

const prompt = basicPrompt.withConstraints(
  'Write a product description',
  [
    'Maximum 150 words',
    'Include 2-3 key benefits',
    'Use marketing language',
    'No technical jargon'
  ]
);

console.log(prompt);
// Formatted prompt with all constraints
```

---

## Level 3: Few-Shot Examples

### Example 3.1: Pattern Recognition with Few-Shot

```javascript
const fewShotPrompt = require('./few_shot_prompt.js');

const examples = [
  { input: 'myVariable', output: 'my-variable' },
  { input: 'userName', output: 'user-name' },
  { input: 'getUserData', output: 'get-user-data' }
];

const prompt = fewShotPrompt.create(
  'Convert camelCase to kebab-case',
  examples,
  'displayName'
);

console.log(prompt);
// Output shows pattern clearly through examples
```

### Example 3.2: Few-Shot with Input-Output Pairs

```javascript
const fewShotPrompt = require('./few_shot_prompt.js');

const pairs = [
  { input: 'The weather is sunny', output: 'positive' },
  { input: 'The weather is rainy', output: 'negative' },
  { input: 'The weather is cloudy', output: 'neutral' }
];

const prompt = fewShotPrompt.fromPairs(
  'Classify sentiment about weather',
  pairs
);

console.log(prompt);
// Compact format with arrow notation
```

### Example 3.3: Few-Shot with Explanations

```javascript
const fewShotPrompt = require('./few_shot_prompt.js');

const examples = [
  {
    input: 'Budget: $1000, Need: Camera + Lens',
    steps: [
      'Determine camera type needed',
      'Research quality options under $800',
      'Allocate remaining $200 for lens',
      'Select best value combination'
    ],
    output: 'Camera: Canon EOS M50 ($699) + Lens: EF 24-105mm ($150)'
  }
];

const prompt = fewShotPrompt.withExplanations(
  'Create shopping recommendations',
  examples
);

console.log(prompt);
// Shows reasoning steps, not just input/output
```

---

## Level 4: Refined Prompt Examples

### Example 4.1: Multi-Component Refined Prompt

```javascript
const refinedPrompt = require('./refined_prompt.js');

const config = {
  objective: 'Generate technical documentation for a REST API',
  context: 'Node.js/Express API with 5 endpoints',
  examples: [
    {
      input: 'GET /api/users/:id',
      output: 'Retrieve user by ID. Returns user object or 404 if not found.'
    }
  ],
  constraints: [
    'Use OpenAPI 3.0 format',
    'Include all parameters and responses',
    'Provide curl examples for each endpoint'
  ],
  format: 'YAML with clear sections',
  tone: 'professional and technical'
};

const prompt = refinedPrompt.create(config);
console.log(prompt);
// Comprehensive, professional prompt
```

### Example 4.2: Iterative Refinement

```javascript
const refinedPrompt = require('./refined_prompt.js');

const basePrompt = `
Task: Review this code for performance issues
Code: [code here]
`;

const refinements = [
  'Focus on O(n²) algorithms',
  'Check for memory leaks',
  'Suggest specific alternatives with examples'
];

const improvedPrompt = refinedPrompt.refine(basePrompt, refinements);
console.log(improvedPrompt);
// Takes basic prompt and iteratively enhances it
```

### Example 4.3: Feedback-Based Iteration

```javascript
const refinedPrompt = require('./refined_prompt.js');

const feedback = [
  'Last response was too technical',
  'Need more practical examples',
  'Include step-by-step instructions',
  'Add warnings about edge cases'
];

const prompt = refinedPrompt.iterative(
  'How to optimize database queries',
  feedback
);

console.log(prompt);
// Addresses previous feedback in new prompt
```

---

## Level 5: Chain Prompt Examples

### Example 5.1: Sequential Steps

```javascript
const chainPrompt = require('./chain_prompt.js');

const steps = [
  { title: 'Analyze Requirements', description: 'Understand what needs to be built' },
  { title: 'Design Architecture', output: 'System design diagram' },
  { title: 'Implement Components', output: 'Working code with tests' },
  { title: 'Integration Testing', output: 'Test results' },
  { title: 'Documentation', output: 'Complete API docs' }
];

const prompt = chainPrompt.create('Build a REST API', steps);
console.log(prompt);
```

### Example 5.2: Chain from Simple Titles

```javascript
const chainPrompt = require('./chain_prompt.js');

const stepTitles = [
  'Understand the problem',
  'Generate multiple solutions',
  'Evaluate trade-offs',
  'Select best solution',
  'Plan implementation'
];

const prompt = chainPrompt.fromTitles(
  'Solve a complex technical problem',
  stepTitles
);

console.log(prompt);
// Quick way to create chains
```

### Example 5.3: Chain with Dependencies

```javascript
const chainPrompt = require('./chain_prompt.js');

const steps = [
  {
    title: 'Extract key information',
    description: 'Identify main topics from the document',
    output: 'List of key topics'
  },
  {
    title: 'Organize hierarchically',
    description: 'Structure topics by importance',
    output: 'Hierarchical outline',
    dependsOn: 1
  },
  {
    title: 'Create summary',
    description: 'Write concise summary based on outline',
    output: 'Executive summary',
    dependsOn: 2
  }
];

const prompt = chainPrompt.withDependencies(
  'Summarize a large document',
  steps
);

console.log(prompt);
```

### Example 5.4: Branching Chain Prompts

```javascript
const chainPrompt = require('./chain_prompt.js');

const branches = [
  {
    name: 'Simple Implementation',
    steps: [
      'Define basic requirements',
      'Implement minimal features',
      'Test basic functionality'
    ]
  },
  {
    name: 'Advanced Implementation',
    steps: [
      'Define all requirements',
      'Design scalable architecture',
      'Implement with best practices',
      'Comprehensive testing',
      'Performance optimization'
    ]
  }
];

const prompt = chainPrompt.withBranches(
  'Implement a user authentication system',
  branches
);

console.log(prompt);
// Shows multiple solution paths
```

---

## Integration Patterns

### Pattern 1: Express.js API Endpoint

```javascript
const express = require('express');
const chainPrompt = require('./chain_prompt.js');

const app = express();
app.use(express.json());

app.post('/api/generate-prompt', (req, res) => {
  const { goal, steps } = req.body;

  try {
    const prompt = chainPrompt.create(goal, steps);
    res.json({ success: true, prompt });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Running on port 3000'));
// Usage: POST /api/generate-prompt with goal and steps
```

### Pattern 2: AI Service Wrapper

```javascript
// ai-service.js
const basicPrompt = require('./basic_prompt.js');

class AIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async prompt(level, params) {
    let prompt;

    switch(level) {
      case 1:
        prompt = `Task: ${params.task}\n${params.instructions}`;
        break;
      case 2:
        prompt = basicPrompt.create(params.task, params.context);
        break;
      case 3:
        // few-shot logic
        break;
      // ... more levels
    }

    return await this._callAPI(prompt);
  }

  async _callAPI(prompt) {
    // Call actual AI service (OpenAI, Anthropic, etc.)
    const response = await fetch('https://api.example.com/generate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({ prompt })
    });
    return response.json();
  }
}

module.exports = AIService;
```

### Pattern 3: Prompt Versioning

```javascript
// prompt-manager.js
class PromptManager {
  constructor() {
    this.prompts = {};
    this.version = '1.0';
  }

  create(name, template) {
    this.prompts[name] = {
      content: template,
      created: new Date(),
      version: this.version
    };
  }

  get(name) {
    return this.prompts[name]?.content;
  }

  update(name, template) {
    if (this.prompts[name]) {
      this.prompts[name].content = template;
      this.prompts[name].updated = new Date();
    }
  }

  list() {
    return Object.keys(this.prompts);
  }
}

// Usage
const manager = new PromptManager();
manager.create('api-docs', refinedPrompt.create({...}));
manager.create('code-review', chainPrompt.create(...));
```

---

## Complete Workflow Scenarios

### Scenario 1: Code Review Workflow

```javascript
const chainPrompt = require('./chain_prompt.js');

// Define the complete code review process
const codeReviewChain = chainPrompt.create(
  'Review and improve provided code',
  [
    {
      title: 'Code Analysis',
      description: 'Identify functionality, patterns, and potential issues',
      output: 'Analysis report'
    },
    {
      title: 'Performance Review',
      description: 'Check for optimization opportunities',
      output: 'Performance issues list',
      dependsOn: 1
    },
    {
      title: 'Security Audit',
      description: 'Identify security vulnerabilities',
      output: 'Security concerns list',
      dependsOn: 1
    },
    {
      title: 'Code Quality Assessment',
      description: 'Review readability, maintainability, documented standards',
      output: 'Quality score and recommendations',
      dependsOn: 1
    },
    {
      title: 'Generate Improvements',
      description: 'Create improved version addressing all findings',
      output: 'Refactored code with explanations',
      dependsOn: [2, 3, 4]
    }
  ]
);

console.log(codeReviewChain);
// Send to AI for complete review process
```

### Scenario 2: Content Creation Workflow

```javascript
const fewShotPrompt = require('./few_shot_prompt.js');
const refinedPrompt = require('./refined_prompt.js');

// Step 1: Generate ideas using few-shot
const ideaExamples = [
  {
    input: 'Topic: AI in Healthcare',
    output: 'Diagnosing diseases faster with machine learning'
  },
  {
    input: 'Topic: AI in Education',
    output: 'Personalized learning paths using AI tutors'
  }
];

const ideasPrompt = fewShotPrompt.create(
  'Generate blog post ideas',
  ideaExamples,
  'Topic: AI in Finance'
);

// Step 2: Refine the chosen idea
const outlinePrompt = refinedPrompt.create({
  objective: 'Create detailed blog post outline',
  context: 'Target: Tech professionals, 1500-2000 words',
  constraints: [
    'Include introduction, 3-4 main sections, conclusion',
    'Provide practical examples',
    'Add actionable takeaways'
  ],
  format: 'Markdown outline with section descriptions',
  tone: 'Informative but accessible'
});

// Step 3: Use chain for actual writing
const writingChain = chainPrompt.create(
  'Write complete blog post',
  [
    'Write engaging introduction',
    'Develop main sections with examples',
    'Write compelling conclusion',
    'Add practical tips section',
    'Format with markdown'
  ]
);
```

### Scenario 3: API Documentation Generation

```javascript
const refinedPrompt = require('./refined_prompt.js');

const docConfig = {
  objective: 'Generate OpenAPI specification for REST API',
  context: `
    Backend: Node.js/Express
    Database: MongoDB
    Authentication: JWT
    Endpoints: 8 total
  `,
  examples: [
    {
      input: 'GET /api/users/:id',
      output: `
        - Summary: Get user by ID
        - Parameters: id (string, required)
        - Response: 200 {user object}
        - Response: 404 if not found
      `
    }
  ],
  constraints: [
    'Follow OpenAPI 3.0 specification',
    'Include all endpoints',
    'Provide example requests/responses',
    'Document all error codes',
    'Include authentication requirements'
  ],
  format: 'YAML file with complete OpenAPI definition',
  tone: 'Technical, precise, complete'
};

const docPrompt = refinedPrompt.create(docConfig);

// Generate API docs using this prompt
```

---

## Testing & Validation

### Unit Test Example

```javascript
// test-prompts.js
const assert = require('assert');
const basicPrompt = require('./basic_prompt.js');

describe('Basic Prompt Template', () => {
  it('should create a properly formatted prompt', () => {
    const prompt = basicPrompt.create(
      'Test task',
      'Test context'
    );
    
    assert(prompt.includes('Task: Test task'));
    assert(prompt.includes('Context: Test context'));
  });

  it('should handle empty context', () => {
    const prompt = basicPrompt.create('Test task');
    assert(!prompt.includes('Context:'));
  });

  it('should format examples correctly', () => {
    const prompt = basicPrompt.withExamples(
      'Task',
      [{ input: 'a', output: 'b' }]
    );
    
    assert(prompt.includes('Examples:'));
    assert(prompt.includes('Input: a'));
    assert(prompt.includes('Output: b'));
  });
});

// Run: npm test
```

### Validation Function

```javascript
// prompt-validator.js
function validatePrompt(prompt) {
  const checks = {
    isEmpty: prompt.length === 0,
    hasTask: prompt.includes('Task:') || prompt.includes('GOAL:'),
    hasClear: prompt.length < 5000, // Not too long
    hasStructure: prompt.includes('\n'), // Properly formatted
    noEmptyLines: !prompt.includes('\n\n\n') // No excessive breaks
  };

  const passed = Object.values(checks).filter(v => v).length;
  const total = Object.keys(checks).length;

  return {
    valid: passed === total,
    passed,
    total,
    details: checks
  };
}

// Usage
const validation = validatePrompt(myPrompt);
console.log(`Prompt is valid: ${validation.valid}`);
```

---

## Best Practices Summary

✅ **DO:**
- Start with examples for clarity
- Test prompts before production use
- Document your prompt choices
- Iterate based on AI response quality
- Use appropriate complexity level

❌ **DON'T:**
- Mix too many constraints
- Create excessively long prompts
- Skip examples for pattern tasks
- Use chain prompts for simple questions
- Ignore validation and testing

---

## Quick Reference

| Task Type | Recommended Template | Method |
|-----------|---------------------|--------|
| Simple question | Zero-Shot | Direct text |
| Structured input | Basic | `create()` |
| Pattern learning | Few-Shot | `fromPairs()` |
| Complex task | Refined | `create()` |
| Multi-step process | Chain | `create()` |

---

## Next Steps

1. **Choose your template level** based on task complexity
2. **Copy a relevant example** from this guide
3. **Customize parameters** for your use case
4. **Test and validate** the prompt output
5. **Iterate** based on results

For more details, reference:
- [PROMPT_TEMPLATES.md](PROMPT_TEMPLATES.md) - Template overview
- [CHAIN_PROMPT_METHODOLOGY.md](CHAIN_PROMPT_METHODOLOGY.md) - Methodology details
- [PROMPT_SYSTEM_INDEX.md](PROMPT_SYSTEM_INDEX.md) - System architecture

