/**
 * Test Helpers Test Suite
 * Demonstrates usage of all test helper utilities
 */

const {
  createMockResponse,
  expectToEqual,
  expectToThrow,
  createTestSuite,
  mockAPI,
  TestTimer,
  DataBuilder
} = require('./testHelpers');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         TEST HELPERS - COMPREHENSIVE DEMO SUITE             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// DEMO 1: createMockResponse
// ============================================================================
console.log('📋 Demo 1: createMockResponse');
console.log('─────────────────────────────────────────────────────────────');

(async () => {
  const response1 = await createMockResponse({ userId: 1, name: 'John' }, {
    statusCode: 200,
    headers: { 'X-Custom': 'header' }
  });
  console.log('✓ Success response:', response1.status, response1.success);

  const response2 = await createMockResponse({ error: 'Not Found' }, {
    statusCode: 404,
    shouldFail: true
  });
  console.log('✓ Error response:', response2.status, response2.error);
})();

// ============================================================================
// DEMO 2: expectToEqual
// ============================================================================
console.log('\n📋 Demo 2: expectToEqual');
console.log('─────────────────────────────────────────────────────────────');

const test1 = expectToEqual(5, 5, 'Basic equality');
console.log(test1.passed ? '✓' : '✗', test1.message);

const test2 = expectToEqual({ a: 1 }, { a: 1 }, 'Object equality');
console.log(test2.passed ? '✓' : '✗', test2.message);

const test3 = expectToEqual('hello', 'world', 'String mismatch');
console.log(test3.passed ? '✓' : '✗', test3.message);

// ============================================================================
// DEMO 3: expectToThrow
// ============================================================================
console.log('\n📋 Demo 3: expectToThrow');
console.log('─────────────────────────────────────────────────────────────');

const throwTest1 = expectToThrow(() => {
  throw new Error('Expected error');
});
console.log(throwTest1.passed ? '✓' : '✗', throwTest1.message);

const throwTest2 = expectToThrow(() => {
  return 'no error';
});
console.log(throwTest2.passed ? '✓' : '✗', throwTest2.message);

// ============================================================================
// DEMO 4: createTestSuite
// ============================================================================
console.log('\n📋 Demo 4: createTestSuite');
console.log('─────────────────────────────────────────────────────────────');

const suite = createTestSuite('Math Tests', [
  {
    name: 'Addition test',
    fn: () => expectToEqual(2 + 2, 4)
  },
  {
    name: 'Subtraction test',
    fn: () => expectToEqual(5 - 3, 2)
  },
  {
    name: 'Multiplication test',
    fn: () => expectToEqual(3 * 4, 12)
  },
  {
    name: 'Division test',
    fn: () => expectToEqual(10 / 2, 5)
  },
  {
    name: 'Failing test',
    fn: () => expectToEqual(1, 2)
  }
]);

console.log(`\n✓ Suite: ${suite.suiteName}`);
console.log(`  Total: ${suite.totalTests}`);
console.log(`  Passed: ${suite.passed}`);
console.log(`  Failed: ${suite.failed}`);
console.log(`  Success Rate: ${suite.successRate}%`);
console.log(`  Summary: ${suite.summary}`);

// ============================================================================
// DEMO 5: mockAPI
// ============================================================================
console.log('\n📋 Demo 5: mockAPI');
console.log('─────────────────────────────────────────────────────────────');

const api = mockAPI({
  '/users': { data: { id: 1, name: 'John' }, statusCode: 200 },
  '/posts': { data: { title: 'Hello', content: 'World' }, statusCode: 200 }
});

(async () => {
  try {
    const users = await api.get('/users');
    console.log('✓ GET /users:', users.status, users.data.name);

    const posts = await api.post('/posts', { author: 'Jane' });
    console.log('✓ POST /posts:', posts.status, posts.data.author);

    api.registerEndpoint('/comments', { message: 'Great post!' });
    const comments = await api.get('/comments');
    console.log('✓ GET /comments:', comments.data.message);
  } catch (error) {
    console.log('✗ API Error:', error.message);
  }
})();

// ============================================================================
// DEMO 6: TestTimer
// ============================================================================
console.log('\n📋 Demo 6: TestTimer');
console.log('─────────────────────────────────────────────────────────────');

const timer = new TestTimer('Sample Operation');
timer.start();

// Simulate operation
setTimeout(() => {
  timer.stop();
  console.log('✓ Operation completed in', timer.getElapsed(), 'ms');

  const check = timer.isWithinThreshold(100);
  console.log(check.message);

  timer.reset();
  console.log('✓ Timer reset');
}, 50);

// ============================================================================
// DEMO 7: DataBuilder
// ============================================================================
console.log('\n📋 Demo 7: DataBuilder');
console.log('─────────────────────────────────────────────────────────────');

const userBuilder = new DataBuilder({
  id: undefined,
  name: 'Default User',
  email: undefined,
  role: 'user'
});

const user1 = userBuilder
  .with('id', 1)
  .with('name', 'Alice')
  .with('email', 'alice@example.com')
  .build();

if (user1.success) {
  console.log('✓ User 1 created:', user1.data.name, `(${user1.data.role})`);
} else {
  console.log('✗ User 1 error:', user1.message);
}

userBuilder.reset();
const user2 = userBuilder
  .with('id', 2)
  .with('email', 'bob@example.com')
  .build();

if (user2.error) {
  console.log('✗ User 2 missing fields:', user2.message);
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         ALL TEST HELPERS DEMONSTRATED SUCCESSFULLY           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Available Test Helpers:');
console.log('  1. createMockResponse  - Create mock HTTP responses');
console.log('  2. expectToEqual       - Assert equality in tests');
console.log('  3. expectToThrow       - Assert error throwing');
console.log('  4. createTestSuite     - Organize and run tests');
console.log('  5. mockAPI             - Mock API endpoints');
console.log('  6. TestTimer           - Measure test performance');
console.log('  7. DataBuilder         - Build test data with fluent API');
console.log('\nAll helpers follow Chain Prompt methodology with:');
console.log('  ✓ Progressive implementation  ✓ Error handling');
console.log('  ✓ Comprehensive validation    ✓ Detailed responses\n');
