# Testing Configuration and Helpers

This directory contains testing utilities, configurations, and test suites for the Anythink Market project.

## Files

### Core Testing Files

- **testHelpers.js** - Test helper utilities (7 utilities)
- **testHelpers.test.js** - Demo and test suite for helpers
- **setup.js** - Jest global test configuration
- **jest.config.js** - Jest configuration file

## Test Helpers

### 1. createMockResponse
Mock HTTP responses for testing
```javascript
const response = await createMockResponse(
  { userId: 1 },
  { statusCode: 200, delay: 100 }
);
```

### 2. expectToEqual
Assert equality in tests
```javascript
const result = expectToEqual(actual, expected, 'Test name');
if (result.passed) console.log(result.message);
```

### 3. expectToThrow
Assert error throwing
```javascript
const result = expectToThrow(() => riskyFunction());
```

### 4. createTestSuite
Organize and run test suites
```javascript
const suite = createTestSuite('My Tests', [
  { name: 'Test 1', fn: () => ({ passed: true }) }
]);
```

### 5. mockAPI
Mock API endpoints
```javascript
const api = mockAPI({
  '/users': { data: { id: 1 } }
});
const response = await api.get('/users');
```

### 6. TestTimer
Measure test performance
```javascript
const timer = new TestTimer('Operation');
timer.start();
// ... operation ...
timer.stop();
console.log(timer.getElapsed()); // ms
```

### 7. DataBuilder
Build test data with fluent API
```javascript
const user = new DataBuilder({ id: undefined, name: 'Default' })
  .with('id', 1)
  .with('name', 'John')
  .build();
```

## Jest Configuration

### Coverage Thresholds
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Global Test Data
Available in `global.testData`:
- validEmails, invalidEmails
- validPasswords, invalidPasswords
- validUsernames, invalidUsernames
- validPhones
- validURLs

### Custom Matchers
- `toBeWithinRange(floor, ceiling)`
- `toBeValidEmail()`
- `toContainObject(expected)`

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npm test -- testHelpers.test.js
```

### Run with coverage
```bash
npm test -- --coverage
```

### Watch mode
```bash
npm test -- --watch
```

## Test Helpers Usage Examples

### Example 1: Testing Utility Functions

```javascript
const { expectToEqual, createTestSuite } = require('./testHelpers');

const suite = createTestSuite('Utility Tests', [
  {
    name: 'String utility test',
    fn: () => expectToEqual(
      stringUtility('input'),
      'expected output'
    )
  }
]);
```

### Example 2: Testing API Integration

```javascript
const { mockAPI } = require('./testHelpers');

const api = mockAPI({
  '/api/users': {
    data: { users: [] },
    statusCode: 200
  }
});

const response = await api.get('/api/users');
```

### Example 3: Performance Testing

```javascript
const { TestTimer } = require('./testHelpers');

const timer = new TestTimer('Database Query');
timer.start();
const result = await db.query('SELECT * FROM users');
timer.stop();

const check = timer.isWithinThreshold(1000);
console.log(check.message); // Performance check
```

### Example 4: Building Test Data

```javascript
const { DataBuilder } = require('./testHelpers');

const userBuilder = new DataBuilder({
  id: undefined,
  email: undefined,
  role: 'user'
});

const testUser = userBuilder
  .with('id', 1)
  .with('email', 'test@example.com')
  .build();
```

## Best Practices

✓ **Do:**
- Use mockAPI for external API calls
- Use DataBuilder for consistent test data
- Use TestTimer for performance tracking
- Use expectToEqual and expectToThrow for assertions
- Organize tests with createTestSuite

✗ **Don't:**
- Mock HTTP requests manually when mockAPI exists
- Create test data inline when DataBuilder helps
- Ignore performance with TestTimer
- Leave error assertions untested

## Contributing New Tests

1. Create test file: `feature.test.js`
2. Import needed helpers
3. Use createTestSuite to organize tests
4. Follow naming conventions
5. Include valid and invalid cases
6. Test error handling

## Integration with CI/CD

The jest.config.js includes:
- junit.xml report generation
- Coverage reporting (HTML, LCOV)
- Test result aggregation
- Error on deprecated APIs

Reports are generated in:
- `coverage/` - Coverage reports
- `test-results/` - JUnit XML results

---

For more information on testing patterns, see [DEVELOPMENT_WORKFLOW.md](../DEVELOPMENT_WORKFLOW.md)
