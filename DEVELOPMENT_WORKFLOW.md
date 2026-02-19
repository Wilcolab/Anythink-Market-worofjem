# Development Workflow Guide

A complete guide for implementing features and fixes using the **Chain Prompt Methodology** in the Anythink Market project.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Workflow Steps](#workflow-steps)
3. [Chain Prompt Methodology](#chain-prompt-methodology)
4. [Examples](#examples)
5. [Best Practices](#best-practices)
6. [Checklist](#checklist)

## Quick Start

### For New Features:
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Break down task into 3-4 progressive steps
3. Implement Step 1 (simple), test it
4. Implement Step 2 (enhanced), test it
5. Implement Step 3 (complete with errors), test it
6. Create comprehensive test file
7. Submit PR with step descriptions

### For Bug Fixes:
1. Create bug branch: `git checkout -b fix/bug-description`
2. Write test that reproduces the bug
3. Implement fix using Chain Prompt approach
4. Verify fix passes all tests
5. Submit PR with before/after explanation

## Workflow Steps

### Phase 1: Planning (5-10 minutes)

**Goal:** Break down the task into 3-4 progressive steps

```
Task: "Implement user input validator"

Step 1: Basic type checking
Step 2: Add format validation
Step 3: Add business logic validation
Step 4: Error handling and messages
```

**Create a branch:**
```bash
git checkout -b feature/user-input-validator
```

### Phase 2: Implementation (30-60 minutes)

**Step 1: Implement Basic Functionality**
- Focus on simple, core logic
- Minimal complexity
- Single responsibility
- Test it works

```javascript
// Step 1: Basic validation
const validateUser = (user) => {
  if (typeof user !== 'object') return false;
  return true;
};
```

**Step 2: Add Intermediate Complexity**
- Build on Step 1
- Add secondary features
- Extend functionality
- Test it integrates with Step 1

```javascript
// Step 2: Add schema validation
const validateUser = (user) => {
  if (typeof user !== 'object') return false;
  if (!user.name || !user.email) return false;
  return true;
};
```

**Step 3: Add Error Handling & Validation**
- Integrate all steps
- Add comprehensive error handling
- Return structured responses
- Add helpful error messages

```javascript
// Step 3: Complete with errors
const validateUser = (user) => {
  if (!user) {
    return { error: true, code: 'NULL_USER', message: 'User required' };
  }
  if (typeof user !== 'object') {
    return { error: true, code: 'INVALID_TYPE', message: 'User must be object' };
  }
  if (!user.name) {
    return { error: true, code: 'MISSING_NAME', message: 'Name required' };
  }
  if (!user.email) {
    return { error: true, code: 'MISSING_EMAIL', message: 'Email required' };
  }
  
  return { success: true, user: user };
};
```

### Phase 3: Testing (15-30 minutes)

**Create comprehensive test file:**

```javascript
// validateUser.test.js
const validateUser = require('./validateUser');

console.log('=== User Validator Tests ===\n');

// Valid cases
console.log('Valid inputs:');
const valid = { name: 'John', email: 'john@example.com' };
console.log(validateUser(valid));

// Invalid cases
console.log('\nInvalid inputs:');
console.log(validateUser(null));
console.log(validateUser({}));
console.log(validateUser({ name: 'John' }));
```

**Run tests:**
```bash
node utils/validateUser.test.js
```

**Verify:**
- ✓ All valid cases return success
- ✓ All invalid cases return appropriate errors
- ✓ Error codes are meaningful
- ✓ No uncaught exceptions

### Phase 4: Commit & Documentation (5-10 minutes)

**Commit with structured message:**

```bash
git add .
git commit -m "feat: Add user input validator with comprehensive error handling

Step 1: Basic type checking
- Validate input is not null
- Check if input is object type

Step 2: Add schema validation
- Require name field
- Require email field
- Validate field existence

Step 3: Complete error handling
- Return structured error objects
- Add meaningful error codes
- Include helpful error messages
- Provide success responses with metadata"
```

**Create Pull Request:**

```
Title: feat: Add user input validator with error handling

Description:
## What
Implement comprehensive user input validation with step-by-step progression.

## Chain Prompt Steps

### Step 1: Basic Type Checking
- Validates input is not null
- Checks if input is object type
- Simple foundation

### Step 2: Schema Validation
- Requires name field
- Requires email field
- Builds on Step 1

### Step 3: Complete Error Handling
- Returns structured error objects
- Includes error codes
- Provides helpful messages
- Returns metadata in success case

## Testing
- Valid inputs: ✓ Accepted
- Null input: ✓ Error with code
- Wrong type: ✓ Error with message
- Missing fields: ✓ Specific error per field

## Files Changed
- utils/validateUser.js (50 lines)
- utils/validateUser.test.js (30 lines)
```

## Chain Prompt Methodology

### The 5 Principles

#### 1. Clarity & Sequencing ✓
Each step follows logically from the previous:

```
Type Check (simplest)
  ↓ depends on
Schema Validation (intermediate)
  ↓ uses
Error Handling (complete)
```

#### 2. Incremental Complexity ✓
Gradual progression in code sophistication:

**Step 1:** 5-10 lines of simple logic
**Step 2:** 15-20 lines adding features
**Step 3:** 30-40 lines with error handling

#### 3. Integration ✓
Final solution combines all steps:

```javascript
// All three steps integrated:
const result = validateUser(input); // Uses all steps
```

#### 4. Error Handling ✓
Comprehensive input validation:

```javascript
if (!input) { /* Handle null */ }
if (typeof input !== 'expected') { /* Handle type */ }
if (!input.required) { /* Handle missing */ }
```

#### 5. Testing ✓
Validation with diverse test cases:

```javascript
// Valid: Normal case
// Invalid: Null/undefined
// Invalid: Wrong type
// Invalid: Missing required fields
// Invalid: Invalid format
```

## Examples

### Example 1: String to Slug Converter

**Planning:**
```
Step 1: Convert to lowercase
Step 2: Replace spaces with hyphens
Step 3: Add error handling
```

**Implementation:**
```javascript
const toSlug = (str) => {
  if (!str || typeof str !== 'string') {
    return { error: true, message: 'Invalid input' };
  }
  
  const slug = str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  return { success: true, slug };
};
```

**Testing:**
```
✓ "Hello World" → "hello-world"
✓ "My Product Name" → "my-product-name"
✗ null → { error: true }
✗ 123 → { error: true }
```

### Example 2: Email Validator

**Planning:**
```
Step 1: Basic format check with regex
Step 2: Validate domain exists
Step 3: Error handling with specific codes
```

**Implementation:**
```javascript
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { error: true, code: 'INVALID_INPUT' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: true, code: 'INVALID_FORMAT' };
  }
  
  const [user, domain] = email.split('@');
  if (!isValidDomain(domain)) {
    return { error: true, code: 'INVALID_DOMAIN' };
  }
  
  return { success: true, email, verified: true };
};
```

## Best Practices

### DO ✓

- **Break into clear steps** - Each with single focus
- **Test each step** - Before moving to next
- **Document progression** - Show step comments
- **Use error codes** - For specific error handling
- **Write test files** - With valid and invalid cases
- **Keep steps focused** - Single responsibility
- **Commit frequently** - After completing each step

### DON'T ✗

- **Skip steps** - Jump directly to complex solution
- **Mix concerns** - Multiple responsibilities per step
- **Ignore errors** - Handle all edge cases
- **Leave untested** - Verify each step works
- **Write vague messages** - Be specific in errors
- **Batch changes** - Commit step-by-step
- **Ignore types** - Validate input types

## Checklist

Before submitting a PR, verify:

### Code Quality
- [ ] Follows Chain Prompt pattern (3-4 steps)
- [ ] Each step builds logically on previous
- [ ] Code is clean and readable
- [ ] No unnecessary complexity
- [ ] Comments explain progression

### Error Handling
- [ ] Input type validation
- [ ] Null/undefined checks
- [ ] Empty value handling
- [ ] Meaningful error messages
- [ ] Structured error objects
- [ ] Error codes for categorization

### Testing
- [ ] Test file created (filename.test.js)
- [ ] Valid inputs tested
- [ ] Invalid inputs tested
- [ ] Edge cases covered
- [ ] All tests pass
- [ ] Run: `node utils/yourfile.test.js`

### Documentation
- [ ] Code commented
- [ ] Steps explained
- [ ] Return format documented
- [ ] Examples in JSDoc
- [ ] Error codes listed

### Git & PR
- [ ] Meaningful commit messages
- [ ] Features branch used
- [ ] PR title explains feature
- [ ] PR description includes:
  - [ ] Overview
  - [ ] Chain Prompt steps
  - [ ] Testing notes
  - [ ] Files changed

### Final Check
- [ ] No console.logs left (except demos)
- [ ] No debug code
- [ ] Consistent naming
- [ ] Consistent error handling
- [ ] Ready for production

## File Template

Create new utilities using this template:

```javascript
/**
 * Function Name - Description
 *
 * Chain Prompt Steps:
 * Step 1: [Basic functionality]
 * Step 2: [Enhanced features]
 * Step 3: [Error handling]
 *
 * @param {type} param - Description
 * @returns {type} Description
 */
const myFunction = (param) => {
  // Input validation
  if (param === null || param === undefined) {
    return {
      error: true,
      code: 'INVALID_NULL',
      message: 'Parameter cannot be null'
    };
  }
  
  if (typeof param !== 'expected_type') {
    return {
      error: true,
      code: 'INVALID_TYPE',
      message: `Expected type, got ${typeof param}`
    };
  }
  
  // Core logic (Steps 1-2)
  const result = performLogic(param);
  
  // Return structured response
  return {
    success: true,
    result: result,
    metadata: { /* useful info */ }
  };
};

module.exports = myFunction;
```

## Getting Help

- **Methodology questions:** See [CONTRIBUTION_GUIDE.md](CONTRIBUTION_GUIDE.md)
- **Utility usage:** See [utils/README.md](utils/README.md)
- **Code examples:** Check [utils/chain_prompt.js](utils/chain_prompt.js)
- **Feature discussion:** Contact @vanessa-cooper

---

**Remember:** The Chain Prompt Methodology isn't just about writing code—it's about writing clear, maintainable, testable code that the whole team can understand and build upon.

Happy coding! 🚀
