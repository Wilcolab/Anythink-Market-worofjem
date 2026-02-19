/**
 * Jest Test Setup File
 * 
 * Global test configuration and utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'ERROR';

// Global test timeout
jest.setTimeout(10000);

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `Expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `Expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  },

  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    if (pass) {
      return {
        message: () => `Expected ${received} not to be a valid email`,
        pass: true
      };
    } else {
      return {
        message: () => `Expected ${received} to be a valid email`,
        pass: false
      };
    }
  },

  toContainObject(received, expected) {
    const pass = received.some(item =>
      Object.keys(expected).every(key => item[key] === expected[key])
    );
    if (pass) {
      return {
        message: () =>
          `Expected array not to contain object matching ${JSON.stringify(expected)}`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `Expected array to contain object matching ${JSON.stringify(expected)}`,
        pass: false
      };
    }
  }
});

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Global test data
global.testData = {
  validEmails: [
    'user@example.com',
    'test.user@example.co.uk',
    'user+tag@example.com'
  ],
  invalidEmails: [
    'invalid',
    '@example.com',
    'user@.com',
    'user@example'
  ],
  validPasswords: [
    'Password123!',
    'MySecurePass2024!',
    'Test@Secure#Pass99'
  ],
  invalidPasswords: [
    'short',
    'nouppercase123!',
    'NOLOWERCASE123!',
    'NoNumbers!'
  ],
  validUsernames: [
    'john_doe',
    'user-123',
    'testuser'
  ],
  invalidUsernames: [
    '_invalid',
    '-invalid',
    'invalid-',
    'inv@lid'
  ],
  validPhones: [
    '1234567890',
    '123-456-7890',
    '+1 (123) 456-7890'
  ],
  validURLs: [
    'https://example.com',
    'http://www.example.com',
    'example.com'
  ]
};

// Helper function for async tests
global.asyncTest = (fn) => {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (error) {
      done(error);
    }
  };
};

// Cleanup after all tests
afterAll(() => {
  jest.clearAllMocks();
});
