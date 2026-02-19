# Contribution Guide - Chain Prompt Methodology

Welcome to the Anythink Market project! This guide explains how to use the **Chain Prompt Methodology** when implementing features and fixes.

## What is Chain Prompt?

Chain Prompt is a structured, step-by-step approach to development that breaks complex tasks into progressive steps, from simple to complex, ensuring clarity and maintainability.

## 5 Core Principles

### 1. Clarity & Sequencing
Each step in your task should be **clear** and **logically follow** from the previous one, ensuring smooth transitions.

**Example:**
```
Step 1: Create a string validation function
  ↓ (depends on)
Step 2: Add pattern matching for specific formats
  ↓ (builds on)
Step 3: Add comprehensive error handling
```

### 2. Incremental Complexity
Start with **easy tasks** and gradually introduce complexity. This helps reviewers and future developers understand the progression.

**Example:**
```
Simple:   Convert string to lowercase
↓
Medium:   Replace spaces with hyphens
↓
Complex:  Add validation and error handling
```

### 3. Integration
By the final steps, all previous modifications should combine into a **coherent, complete solution** that achieves the initial goal.

**Example:**
```
toKebabCase("Hello World")
// Step 1: "hello world" (lowercase)
// Step 2: "hello-world" (spaces → hyphens)
// Step 3: {success: true, result: "hello-world"} (with validation)
```

### 4. Error Handling Considerations
Think about what could go wrong with inputs or the process. Guide your implementation to handle these errors effectively.

**Checklist:**
- ✓ Validate input types
- ✓ Check for null/undefined values
- ✓ Handle edge cases (empty strings, whitespace)
- ✓ Provide meaningful error messages
- ✓ Return structured error objects

### 5. Testing
Test each step and verify the full solution works with both valid and invalid inputs.

**Testing Strategy:**
```
Test Valid Cases:
  ✓ Normal inputs
  ✓ Edge cases at boundaries
  
Test Invalid Cases:
  ✓ Null/undefined
  ✓ Wrong types
  ✓ Empty/whitespace values
  ✓ Special characters
```

## How to Use Chain Prompt in Development

### Step 1: Plan Your Task
Break down your feature/fix into 3-4 progressive steps:

```markdown
Task: Implement email validator

Step 1: Basic email format check (simple regex)
Step 2: Add domain validation (check TLDs)
Step 3: Add DNS verification (advanced)
Step 4: Error handling & messages (integration)
```

### Step 2: Write Each Step
Implement one step at a time, fully testing before moving to the next:

```javascript
// Step 1: Basic email regex
const validateEmail = (email) => {
  return /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
};

// Step 2: Add domain validation (on top of Step 1)
const validateEmail = (email) => {
  const basicCheck = /^[^@]+@[^@]+\.[a-z]{2,}$/.test(email);
  if (!basicCheck) return false;
  
  const domain = email.split('@')[1];
  return isValidDomain(domain);
};

// Step 3: Add error handling (complete)
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { error: true, message: 'Invalid input' };
  }
  // ... rest of logic
};
```

### Step 3: Document Your Progress
Add comments showing the step progression:

```javascript
/**
 * Step 1: Basic validation
 * Step 2: Add feature X
 * Step 3: Add error handling
 */
const myFunction = (input) => {
  // Implementation
};
```

### Step 4: Test & Verify
Run tests at each stage and create a test file demonstrating all steps.

```javascript
// test.js - Demonstrates all 3 steps
console.log('Step 1 result:', step1Test());
console.log('Step 2 result:', step2Test());
console.log('Step 3 result:', step3Test()); // Full solution
```

## Project Examples

### toKebabCase
A complete example of Chain Prompt methodology:

- **Step 1:** Basic lowercase conversion
- **Step 2:** Space-to-hyphen replacement  
- **Step 3:** Error handling with validation

See: [utils/chain_prompt.js](utils/chain_prompt.js)

## Code Review Checklist

When reviewing Chain Prompt implementations, verify:

- [ ] Each step builds logically on previous
- [ ] Complexity increases gradually
- [ ] No unnecessary jumps in logic
- [ ] Error handling is comprehensive
- [ ] Tests cover valid and invalid cases
- [ ] Documentation explains progression
- [ ] Code is well-commented

## PR Title Convention

Use this format for PRs using Chain Prompt:

```
feat: [feature name] - chain prompt implementation

Step 1: [description]
Step 2: [description]
Step 3: [description]
```

## Common Patterns

### Pattern 1: Validation → Enhancement → Error Handling
```
Step 1: Check if input exists
Step 2: Validate input format
Step 3: Add error messages and status codes
```

### Pattern 2: Basic Function → Expansion → Robustness
```
Step 1: Core functionality
Step 2: Add edge case handling
Step 3: Add logging and error recovery
```

### Pattern 3: Simple → Optimized → Advanced
```
Step 1: Working solution
Step 2: Performance improvements
Step 3: Advanced features and caching
```

## Best Practices

✓ **Do:**
- Start with simple, understandable tasks
- Make each step completion testable
- Document assumptions and limitations
- Include real test cases
- Keep steps focused and single-purpose

✗ **Don't:**
- Skip steps or jump to complexity too quickly
- Mix unrelated concerns in one step
- Leave intermediate steps untested
- Ignore error cases
- Write vague commit messages

## Questions?

For questions about the Chain Prompt methodology, refer to:
- [chain_prompt.js](utils/chain_prompt.js) - Full implementation example
- [toKebabCase.js](utils/toKebabCase.js) - Complete utility with error handling
- PM @vanessa-cooper for feature discussion

---

**Remember:** Chain Prompt isn't just about code structure—it's about making your development process clear, testable, and maintainable for the entire team.
