/**
 * CHAIN PROMPT: toKebabCase Function with Sequential Steps
 * 
 * This prompt uses a chained approach where each step builds upon the previous one.
 * Follow these steps in order to create a robust toKebabCase function.
 * 
 * ===== STEP 1: Function Foundation & Input Validation =====
 * Create a function named `toKebabCase` that:
 * - Accepts a single parameter `input`
 * - Validates that input is not null or undefined (throw Error if it is)
 * - Validates that input is a string (throw Error with type name if it isn't)
 * - Trims whitespace from the input
 * - Returns an empty string if input is empty or only whitespace
 * 
 * ===== STEP 2: String Transformation Logic =====
 * Now implement the core conversion logic:
 * - Convert the trimmed input to lowercase
 * - Split the string by multiple consecutive separators (spaces, underscores, hyphens)
 * - Filter out any empty values that result from the split
 * - Join the resulting words with hyphens (kebab-case uses hyphens, not camelCase or dots)
 * - Handle camelCase inputs by inserting hyphens before uppercase letters
 * 
 * ===== STEP 3: Error Handling & Comprehensive Testing =====
 * Complete the function with:
 * - JSDoc documentation with @param, @returns, @throws, and @example tags
 * - Test cases for valid inputs (8+ examples covering all separator types)
 * - Error handling examples with try-catch blocks (5+ error scenarios)
 * - Edge case tests (empty strings, whitespace-only, mixed separators)
 * - Export the function as a module
 * 
 * ===== EXAMPLES TO HANDLE =====
 * Valid conversions:
 * - "firstName" → "first-name"
 * - "first name" → "first-name"
 * - "first_name" → "first-name"
 * - "FIRST_NAME" → "first-name"
 * - "first-name" → "first-name"
 * - "  first   name  " → "first-name"
 * - "first___name---example" → "first-name-example"
 * - "firstName123Id" → "first-name123-id"
 */
