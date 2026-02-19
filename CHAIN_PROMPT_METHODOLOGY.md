# Chain Prompt Methodology

## Overview

The **Chain Prompt Methodology** is a structured approach to breaking down complex AI tasks into sequential, progressive steps where each step builds upon the previous one. This document explains the methodology and how to apply it using the provided template files.

---

## What is Chain Prompting?

Chain Prompting involves:
1. **Decomposing** a complex goal into simpler, sequential steps
2. **Building** each step upon the conclusions of the previous step
3. **Establishing** dependencies between steps to create a clear workflow
4. **Branching** when necessary to handle multiple solution paths
5. **Validating** at checkpoints to ensure progress toward the goal

---

## The 5-Level Prompt Hierarchy

### Level 1: Zero-Shot Prompts
**Characteristics:**
- No examples provided
- Relies entirely on AI's pre-trained knowledge
- Simplest form of prompting

**When to Use:**
- Task is well-defined and unambiguous
- AI has clear prior knowledge of the task
- Speed is more important than detailed guidance

**Example:**
```
Task: What are the benefits of cloud computing?
```

---

### Level 2: Basic Prompts
**Characteristics:**
- Structured format with task and context
- Optional examples and constraints
- Establishes a repeatable template

**When to Use:**
- Need consistent prompt formatting
- Want to add optional guidance
- Building foundation for more complex tasks

**Template Structure:**
```javascript
{
  task: "description of what to do",
  context: "relevant background information",
  examples: [], // optional
  constraints: [] // optional
}
```

---

### Level 3: Few-Shot Prompts
**Characteristics:**
- Provides 2-5 concrete examples
- Establishes pattern recognition
- Shows input-output relationship

**When to Use:**
- Task has recognizable patterns
- Examples can clarify expected output
- Need to guide AI's response style

**Example:**
```javascript
{
  task: "Convert to kebab-case",
  examples: [
    { input: "myVariable", output: "my-variable" },
    { input: "userName", output: "user-name" },
    { input: "displayName", output: "display-name" }
  ],
  input: "lastName"  // What we want converted
}
```

---

### Level 4: Refined Prompts
**Characteristics:**
- Multiple components (objective, context, examples, constraints, format)
- Iterative refinement capability
- Detailed specification of expectations

**When to Use:**
- Complex tasks with multiple requirements
- Need fine-grained control over output
- Quality is critical

**Template Structure:**
```javascript
{
  objective: "clear goal statement",
  context: "background and scope",
  examples: [],
  constraints: ["limit 1", "limit 2"],
  format: "expected output format",
  tone: "desired communication style",
  validation: "how to verify correctness"
}
```

---

### Level 5: Chain Prompts (Advanced)
**Characteristics:**
- Breaks tasks into sequential steps
- Defines dependencies between steps
- Supports conditional branching
- Validates progress at each stage

**When to Use:**
- Complex multi-step processes
- Steps build on each other's results
- Need to handle multiple solution paths
- Task requires iterative refinement

**Template Structure:**
```javascript
{
  goal: "ultimate objective",
  steps: [
    "Step 1: Foundation",
    "Step 2: Building on Step 1",
    "Step 3: Building on Step 2",
    "Step 4: Integration",
    "Step 5: Validation"
  ],
  dependencies: {
    2: [1],        // Step 2 depends on Step 1
    3: [2],        // Step 3 depends on Step 2
    4: [2, 3],     // Step 4 depends on Steps 2 and 3
    5: [4]         // Step 5 depends on Step 4
  },
  validation: {
    checkpoints: [1, 3, 5],  // Validate at these steps
    criteria: "how to validate success"
  }
}
```

---

## Chain Prompt Principles

### 1. Clarity
Each step must be unambiguous and self-contained.

### 2. Progression
Steps should build logically, with clear input-output relationships.

### 3. Granularity
Break down tasks into atomic steps that can be completed independently.

### 4. Validation
Include checkpoints to verify correctness before proceeding.

### 5. Flexibility
Allow branching for different solution paths or edge cases.

---

## Real-World Example: Code Refactoring

### Goal
Refactor a function to improve performance while maintaining functionality.

### Chain Prompt Structure

```javascript
const codeRefactorChain = chainPromptTemplate.create(
  "Refactor getUser function to improve performance",
  [
    "Step 1: Analyze current implementation and identify bottlenecks",
    "Step 2: Research optimization patterns for similar operations",
    "Step 3: Propose 2-3 optimization strategies with trade-offs",
    "Step 4: Implement the recommended optimization",
    "Step 5: Add comprehensive tests for the refactored function",
    "Step 6: Benchmark old vs new implementation",
    "Step 7: Document changes and performance improvements"
  ]
);

codeRefactorChain.withDependencies({
  2: [1],  // Research after analysis
  3: [2],  // Propose after research
  4: [3],  // Implement after selection
  5: [4],  // Test after implementation
  6: [5],  // Benchmark with tests passing
  7: [6]   // Document after validation
});

codeRefactorChain.withBranches({
  3: {
    condition: "if_optimization_simple",
    true: 4,   // Skip testing for simple changes
    false: 5   // Full testing for complex changes
  }
});
```

---

## Implementation Using Provided Templates

### Using basic_prompt.js
```javascript
const task = basicPromptTemplate.create(
  "Summarize this technical paper",
  "Focus on the methodology and results"
);

const prompt = task
  .withExamples([
    { title: "Example Paper", summary: "..." }
  ])
  .withConstraints([
    "Maximum 500 words",
    "Use technical terminology"
  ])
  .build();
```

### Using few_shot_prompt.js
```javascript
const task = fewShotPromptTemplate.create(
  "Extract project requirements from text",
  [
    {
      input: "User story text...",
      output: { requirements: [...], assumptions: [...] }
    }
  ],
  "New project description"
);
```

### Using refined_prompt.js
```javascript
const task = refinedPromptTemplate.create({
  objective: "Generate API documentation",
  context: "For a Node.js REST API",
  examples: [{ endpoint: "/api/users", documentation: "..." }],
  constraints: ["Use OpenAPI 3.0 format"],
  format: "YAML with descriptions",
  tone: "professional and concise"
});
```

### Using chain_prompt.js
```javascript
const task = chainPromptTemplate.create(
  "Build and deploy a new feature",
  [
    "Design API endpoints and data models",
    "Implement backend logic and tests",
    "Create frontend components",
    "Integrate frontend and backend",
    "Perform end-to-end testing",
    "Deploy to staging environment",
    "Deploy to production"
  ]
);

task.withDependencies({
  2: [1], 3: [1], 4: [2, 3], 5: [4], 6: [5], 7: [6]
});
```

---

## When to Use Each Level

| Complexity | Clarity | Use Level |
|-----------|---------|-----------|
| Simple, well-known | High | Zero-Shot (Level 1) |
| Basic with guidelines | Medium | Basic (Level 2) |
| Pattern-based | Medium | Few-Shot (Level 3) |
| Complex, multi-faceted | Medium-High | Refined (Level 4) |
| Multi-step workflows | Any | Chain (Level 5) |

---

## Best Practices

1. **Start at the appropriate level** - Don't over-engineer simple tasks
2. **Be explicit about dependencies** - Make relationships clear
3. **Define validation criteria** - Know when each step is complete
4. **Plan for errors** - Include error handling branches
5. **Document step outputs** - Be clear about what each step produces
6. **Test systematically** - Validate at checkpoints
7. **Refine iteratively** - Use feedback to improve prompts

---

## Common Patterns

### Pattern 1: Linear Sequence
Sequential steps with no branching.

### Pattern 2: Diamond Dependency
Multiple paths converging to a single step.

### Pattern 3: Conditional Branching
Different paths based on Step N results.

### Pattern 4: Parallel Steps
Independent steps that can run simultaneously (conceptually).

### Pattern 5: Iterative Loop
Steps that repeat with refinements.

---

## Troubleshooting

**Problem:** AI misunderstands a step
**Solution:** Break it into smaller, clearer sub-steps

**Problem:** Chain is too long
**Solution:** Consolidate related steps or use sub-chains

**Problem:** Outputs don't match expectations
**Solution:** Add examples to few-shot or refine constraints

**Problem:** AI ignores dependencies
**Solution:** Explicitly reference previous step in next step

---

## File References

- `zero_shot_prompt.txt` - Zero-shot reference guide
- `basic_prompt.js` - Basic prompt templates
- `few_shot_prompt.js` - Few-shot prompt implementations
- `refined_prompt.js` - Refined prompt utilities
- `chain_prompt.js` - Chain prompt core methodology (you are here)

---

## Next Steps

1. Review the specific template files for detailed API documentation
2. Start with simple prompts (Level 1-2)
3. Graduate to few-shot when patterns emerge (Level 3)
4. Use refined prompts for complex tasks (Level 4)
5. Employ chain prompts for multi-step workflows (Level 5)

