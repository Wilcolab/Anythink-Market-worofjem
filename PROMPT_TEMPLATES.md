# Prompt Template Documentation

This directory contains a complete prompt engineering framework for AI assistance tasks. These templates follow the **Chain Prompt Methodology**, progressing from basic prompts to complex, structured workflows.

## Core Files (Protected)

These files form the foundation of the prompt engineering system and should not be modified:

### 1. `zero_shot_prompt.txt`
**Purpose:** Reference guide for zero-shot prompting

A zero-shot prompt is a request given to an AI without any prior examples. It relies on pre-trained knowledge to understand and respond appropriately.

**Use Cases:**
- Well-known, straightforward tasks
- Unique problems without direct examples
- Rapid prototyping and experimentation

**Key Principle:** Maximum simplicity with clear instructions.

---

### 2. `basic_prompt.js`
**Purpose:** Foundational prompt template utilities

Provides basic methods for constructing simple prompts with:
- **`create(task, context)`** - Create basic task prompts
- **`withExamples(examples)`** - Add example patterns
- **`withConstraints(constraints)`** - Define limitations and rules

**Use When:** Starting with simple, single-turn tasks.

---

### 3. `few_shot_prompt.js`
**Purpose:** Few-shot prompt templates with examples

Provides 2-5 example-based prompts to establish patterns for the AI:
- **`create(task, examples, newInput)`** - Few-shot template
- **`fromPairs(pairs)`** - Input-output pair examples
- **`withExplanations(explanations)`** - Add reasoning examples

**Use When:** Task requires pattern demonstration but doesn't need step-by-step guidance.

---

### 4. `refined_prompt.js`
**Purpose:** Refined prompts with iterative improvement

Sophisticated prompt structure combining multiple elements:
- **`create(config)`** - Multi-component refined prompt
- **`refine(feedback)`** - Iterative refinement loop
- **`iterative(steps)`** - Multi-iteration approach

**Use When:** Complex tasks requiring careful instruction and refinement.

---

### 5. `chain_prompt.js`
**Purpose:** Chain Prompt Methodology - Sequential step execution

Breaking complex tasks into progressive, dependent steps:
- **`create(goal, steps)`** - Define goal and sequential steps
- **`fromTitles(titles)`** - Build from step titles
- **`withDependencies(dependencies)`** - Set step relationships
- **`withBranches(branches)`** - Enable conditional branching

**Use When:** Complex multi-step tasks requiring sequential reasoning and conditional branching.

---

## Prompt Engineering Progression

```
Level 1: Zero-Shot
└─ No examples, only clear instruction

Level 2: Basic Prompt
└─ Foundational structure with optional examples and constraints

Level 3: Few-Shot Prompt
└─ 2-5 examples to establish patterns and expectations

Level 4: Refined Prompt
└─ Multi-component structure with iterative refinement capability

Level 5: Chain Prompt (Advanced)
└─ Sequential steps with dependencies, branching, and complex reasoning
```

---

## Usage Examples

### Example 1: Zero-Shot Task
```javascript
const prompt = `
Task: Summarize the key benefits of this feature.

Instructions:
- Keep it to 3 bullet points
- Use technical language
- Focus on user impact
`;
```

### Example 2: Basic Prompt with Examples
```javascript
const basicPrompt = basicPromptTemplate.create(
  "Convert camelCase to kebab-case",
  "Standard variable naming conversion"
);

basicPrompt.withExamples([
  { input: "myVariable", output: "my-variable" },
  { input: "userName", output: "user-name" }
]);
```

### Example 3: Few-Shot Learning
```javascript
const fewShotPrompt = fewShotPromptTemplate.create(
  "Classify sentiment",
  [
    { input: "I love this!", sentiment: "positive" },
    { input: "This is terrible", sentiment: "negative" },
    { input: "It's okay", sentiment: "neutral" }
  ],
  "What about this review?"
);
```

### Example 4: Chain Prompt Workflow
```javascript
const chainPrompt = chainPromptTemplate.create(
  "Refactor code to improve performance",
  [
    "Identify performance bottlenecks",
    "Research optimization techniques",
    "Implement improvements",
    "Run benchmarks",
    "Document changes"
  ]
);

chainPrompt.withDependencies({
  2: [1],  // Step 2 depends on Step 1
  3: [2],  // Step 3 depends on Step 2
  4: [3],  // Step 4 depends on Step 3
  5: [4]   // Step 5 depends on Step 4
});
```

---

## Best Practices

1. **Start Simple** - Begin with zero-shot or basic prompts
2. **Add Examples** - Use few-shot when patterns aren't obvious
3. **Refine Iteratively** - Use refined prompts for complex tasks
4. **Break Down Complex Tasks** - Use chain prompts for multi-step workflows
5. **Test and Validate** - Always verify outputs match expectations
6. **Document Steps** - Clear step descriptions improve AI understanding
7. **Handle Edge Cases** - Define constraints and error scenarios

---

## Integration with AI Workflows

These templates integrate with:
- Direct AI API calls for prompt engineering
- Automated task decomposition systems
- Multi-step reasoning pipelines
- Iterative refinement loops
- Chain-of-thought prompting strategies

---

## File Status

These are **protected core files** - they establish the foundation of the prompt engineering framework and should not be removed or heavily modified. Extensions and variations should be created as separate files in appropriate directories.

---

## Related Files

- `CONTRIBUTION_GUIDE.md` - Guidelines for extending the prompt system
- `DEVELOPMENT_WORKFLOW.md` - Workflow for prompt testing and validation
- Tests and examples in respective test directories

