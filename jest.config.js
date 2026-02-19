/**
 * Jest Configuration for Unit Tests
 * 
 * Comprehensive Jest setup for testing Anythink Market utilities and validators
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test patterns
  testMatch: [
    '<rootDir>/utils/**/*.test.js',
    '<rootDir>/tests/**/*.test.js'
  ],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'utils/**/*.js',
    'tests/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**'
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Module paths
  modulePaths: ['<rootDir>'],

  // Watch plugins
  watchPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Reporters configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results',
        outputName: 'junit.xml'
      }
    ]
  ],

  // Error on deprecated APIs
  errorOnDeprecated: true
};
