/**
 * Test Helpers Utility
 * 
 * Provides utility functions to simplify testing and assertions
 * Follows Chain Prompt methodology with progressive implementation
 */

/**
 * HELPER 1: createMockResponse
 * Create mock HTTP responses for testing
 * 
 * Step 1: Basic response object creation
 * Step 2: Add status codes and headers
 * Step 3: Add validation and error handling
 */
const createMockResponse = (data = {}, options = {}) => {
  const {
    statusCode = 200,
    headers = {},
    delay = 0,
    shouldFail = false
  } = options;

  if (typeof data !== 'object' || data === null) {
    return {
      error: true,
      code: 'INVALID_DATA',
      message: 'Data must be a valid object'
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          status: statusCode,
          headers,
          error: true,
          data: null
        });
      } else {
        resolve({
          status: statusCode,
          headers: { 'Content-Type': 'application/json', ...headers },
          data: data,
          success: true
        });
      }
    }, delay);
  });
};

/**
 * HELPER 2: expectToEqual
 * Assertion helper for testing equality
 * 
 * Step 1: Basic equality check
 * Step 2: Add type checking
 * Step 3: Add detailed error reporting
 */
const expectToEqual = (actual, expected, testName = '') => {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);

  return {
    passed: passed,
    testName: testName,
    actual: actual,
    expected: expected,
    message: passed
      ? `✓ ${testName} passed`
      : `✗ ${testName} failed\n  Expected: ${JSON.stringify(expected)}\n  Received: ${JSON.stringify(actual)}`
  };
};

/**
 * HELPER 3: expectToThrow
 * Assertion helper for testing error throwing
 * 
 * Step 1: Execute function and catch errors
 * Step 2: Check if error was thrown
 * Step 3: Validate error type/message
 */
const expectToThrow = (fn, expectedError = null) => {
  try {
    fn();
    return {
      passed: false,
      message: 'Expected function to throw an error, but it did not',
      error: null
    };
  } catch (error) {
    if (expectedError && error.message !== expectedError) {
      return {
        passed: false,
        message: `Expected error: "${expectedError}", but got: "${error.message}"`,
        error: error.message
      };
    }
    return {
      passed: true,
      message: 'Function correctly threw an error',
      error: error.message
    };
  }
};

/**
 * HELPER 4: createTestSuite
 * Create and run a test suite
 * 
 * Step 1: Organize tests in groups
 * Step 2: Execute each test
 * Step 3: Generate detailed report
 */
const createTestSuite = (suiteName, tests = []) => {
  if (!Array.isArray(tests)) {
    return {
      error: true,
      code: 'INVALID_TESTS',
      message: 'Tests must be an array'
    };
  }

  const results = tests.map(test => {
    if (typeof test.fn !== 'function') {
      return {
        name: test.name,
        passed: false,
        message: 'Test function is not callable'
      };
    }

    try {
      const result = test.fn();
      return {
        name: test.name,
        passed: result.passed !== false,
        message: result.message || 'Test passed',
        duration: result.duration || 0
      };
    } catch (error) {
      return {
        name: test.name,
        passed: false,
        message: error.message,
        error: error
      };
    }
  });

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  return {
    suiteName: suiteName,
    totalTests: results.length,
    passed: passed,
    failed: failed,
    successRate: ((passed / results.length) * 100).toFixed(2),
    results: results,
    summary: `${passed}/${results.length} tests passed`
  };
};

/**
 * HELPER 5: mockAPI
 * Mock API responses for testing
 * 
 * Step 1: Basic endpoint mocking
 * Step 2: Add different HTTP methods
 * Step 3: Add delay and error simulation
 */
const mockAPI = (endpoints = {}) => {
  if (typeof endpoints !== 'object') {
    return {
      error: true,
      code: 'INVALID_ENDPOINTS',
      message: 'Endpoints must be an object'
    };
  }

  return {
    get: function(path, options = {}) {
      const endpoint = endpoints[path];
      if (!endpoint) {
        return Promise.reject({
          error: true,
          code: '404',
          message: `Endpoint ${path} not found`
        });
      }
      return createMockResponse(endpoint.data, { ...endpoint, ...options });
    },

    post: function(path, body, options = {}) {
      const endpoint = endpoints[path];
      if (!endpoint) {
        return Promise.reject({
          error: true,
          code: '404',
          message: `Endpoint ${path} not found`
        });
      }
      return createMockResponse({ ...endpoint.data, ...body }, {
        ...endpoint,
        ...options,
        statusCode: options.statusCode || 201
      });
    },

    registerEndpoint: function(path, data, options = {}) {
      endpoints[path] = { data, ...options };
      return { success: true, message: `Endpoint registered: ${path}` };
    }
  };
};

/**
 * HELPER 6: TestTimer
 * Simple timing utility for performance testing
 * 
 * Step 1: Start and stop timer
 * Step 2: Calculate elapsed time
 * Step 3: Add performance thresholds
 */
class TestTimer {
  constructor(name = 'Test') {
    this.name = name;
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = Date.now();
    return { success: true, message: `Timer started: ${this.name}` };
  }

  stop() {
    if (!this.startTime) {
      return {
        error: true,
        code: 'NOT_STARTED',
        message: 'Timer was not started'
      };
    }
    this.endTime = Date.now();
    return { success: true, elapsed: this.getElapsed() };
  }

  getElapsed() {
    if (!this.startTime || !this.endTime) {
      return null;
    }
    return this.endTime - this.startTime;
  }

  isWithinThreshold(threshold) {
    const elapsed = this.getElapsed();
    if (elapsed === null) {
      return {
        error: true,
        message: 'Timer not properly started/stopped'
      };
    }
    const withinThreshold = elapsed <= threshold;
    return {
      success: true,
      withinThreshold: withinThreshold,
      elapsed: elapsed,
      threshold: threshold,
      message: withinThreshold
        ? `✓ Completed within ${threshold}ms (took ${elapsed}ms)`
        : `✗ Exceeded threshold: took ${elapsed}ms (max: ${threshold}ms)`
    };
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    return { success: true, message: 'Timer reset' };
  }
}

/**
 * HELPER 7: DataBuilder
 * Build test data with defaults and overrides
 * 
 * Step 1: Define default data structure
 * Step 2: Allow partial overrides
 * Step 3: Add validation
 */
class DataBuilder {
  constructor(defaults = {}) {
    this.defaults = defaults;
    this.overrides = {};
  }

  with(key, value) {
    this.overrides[key] = value;
    return this;
  }

  build() {
    const merged = { ...this.defaults, ...this.overrides };
    
    // Validate required fields
    const requiredFields = Object.keys(this.defaults).filter(
      key => this.defaults[key] === undefined
    );
    
    const missingFields = requiredFields.filter(
      key => !(key in merged) || merged[key] === undefined
    );

    if (missingFields.length > 0) {
      return {
        error: true,
        code: 'MISSING_FIELDS',
        message: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    return {
      success: true,
      data: merged
    };
  }

  reset() {
    this.overrides = {};
    return this;
  }
}

module.exports = {
  createMockResponse,
  expectToEqual,
  expectToThrow,
  createTestSuite,
  mockAPI,
  TestTimer,
  DataBuilder
};
