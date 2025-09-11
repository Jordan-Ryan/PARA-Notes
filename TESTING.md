# PARA Notes - Comprehensive Testing Strategy

This document outlines the complete testing strategy for the PARA Notes application, covering unit tests, integration tests, component tests, end-to-end tests, and security tests for both web and mobile platforms.

## Table of Contents

- [Overview](#overview)
- [Testing Framework](#testing-framework)
- [Test Categories](#test-categories)
- [Running Tests](#running-tests)
- [Test Configuration](#test-configuration)
- [Mocking Strategy](#mocking-strategy)
- [Coverage Requirements](#coverage-requirements)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

The PARA Notes application uses a comprehensive testing strategy that ensures reliability, security, and maintainability across both web (Next.js) and mobile (React Native) platforms.

### Key Testing Principles

- **Test Pyramid**: Unit tests form the foundation, with fewer integration and E2E tests
- **Test-Driven Development**: Write tests before implementing features
- **Comprehensive Coverage**: Aim for 80%+ code coverage across all test types
- **Security-First**: Security tests are integrated into the development workflow
- **Cross-Platform**: Consistent testing approach for web and mobile

## Testing Framework

### Web Application (Next.js)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **Component Tests**: React Testing Library + Jest
- **E2E Tests**: Playwright
- **Security Tests**: Playwright + Custom security utilities

### Mobile Application (React Native)

- **Unit Tests**: Jest + React Native Testing Library
- **Integration Tests**: Jest + MSW
- **Component Tests**: React Native Testing Library + Jest
- **E2E Tests**: Detox
- **Security Tests**: Detox + Custom security utilities

## Test Categories

### 1. Unit Tests

#### PARA Classification Algorithms
- **Location**: `tests/unit/lib/guidance/paraClassifier.test.ts`
- **Coverage**: Classification logic, learning weights, rule matching
- **Key Tests**:
  - Correct category classification based on keywords
  - Context path matching
  - Learning weight application
  - User rule overrides
  - Edge cases and error handling

#### Encryption/Decryption Functions
- **Location**: `tests/unit/lib/editor/crypto.test.ts`
- **Coverage**: AES-GCM encryption, key derivation, error handling
- **Key Tests**:
  - Successful encryption/decryption roundtrip
  - Different input types and sizes
  - Error handling for invalid inputs
  - Key derivation security
  - Cross-platform compatibility

#### Data Validation Utilities
- **Location**: `tests/unit/lib/utils/validation.test.ts`
- **Coverage**: Zod schemas, input sanitization, validation rules
- **Key Tests**:
  - Valid data acceptance
  - Invalid data rejection
  - HTML sanitization
  - Email/URL validation
  - UUID validation

#### Custom React Hooks
- **Location**: `tests/unit/hooks/useAuth.test.tsx`
- **Coverage**: Authentication state, API calls, error handling
- **Key Tests**:
  - Successful authentication flows
  - Error handling and recovery
  - Loading states
  - Network error handling

#### Zustand Store Actions
- **Location**: `tests/unit/stores/notesStore.test.ts`
- **Coverage**: State management, actions, persistence
- **Key Tests**:
  - State updates
  - Action dispatching
  - Persistence behavior
  - Error handling

### 2. Integration Tests

#### Supabase RLS Policies
- **Location**: `tests/integration/supabase/rls.test.ts`
- **Coverage**: Row-level security, data isolation, access control
- **Key Tests**:
  - User can only access their own data
  - Cross-user data access prevention
  - Unauthenticated access blocking
  - Policy enforcement

#### RPC Function Behavior
- **Location**: `tests/integration/supabase/rpc.test.ts`
- **Coverage**: Database functions, business logic, error handling
- **Key Tests**:
  - PARA structure creation
  - Note classification suggestions
  - Search functionality
  - Folder hierarchy management

#### Real-time Sync Scenarios
- **Location**: `tests/integration/sync/`
- **Coverage**: Conflict resolution, offline handling, data consistency
- **Key Tests**:
  - Online/offline transitions
  - Conflict detection and resolution
  - Data synchronization
  - Queue management

#### Storage Upload/Download
- **Location**: `tests/integration/storage/`
- **Coverage**: File operations, permissions, error handling
- **Key Tests**:
  - File upload success/failure
  - Download permissions
  - File type validation
  - Size limits

### 3. Component Tests

#### React Testing Library Tests
- **Location**: `tests/component/features/notes/NoteEditor.test.tsx`
- **Coverage**: UI components, user interactions, accessibility
- **Key Tests**:
  - Component rendering
  - User interactions
  - Props handling
  - Event callbacks
  - Error states

#### User Interaction Flows
- **Location**: `tests/component/flows/`
- **Coverage**: Complete user journeys, form submissions, navigation
- **Key Tests**:
  - Note creation flow
  - Authentication flow
  - Search and filtering
  - Settings management

#### Error Boundary Behavior
- **Location**: `tests/component/error-boundaries/`
- **Coverage**: Error catching, fallback UI, recovery
- **Key Tests**:
  - Error boundary activation
  - Fallback component rendering
  - Error recovery
  - Error reporting

#### Accessibility Compliance
- **Location**: `tests/component/accessibility/`
- **Coverage**: WCAG compliance, screen reader support, keyboard navigation
- **Key Tests**:
  - ARIA attributes
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast

### 4. End-to-End Tests

#### Web Application (Playwright)
- **Location**: `tests/e2e/`
- **Coverage**: Complete user workflows, cross-browser compatibility
- **Key Tests**:
  - Authentication flow
  - Note management
  - PARA organization
  - Search and filtering
  - Settings and preferences

#### Mobile Application (Detox)
- **Location**: `tests/e2e/`
- **Coverage**: Mobile-specific features, device interactions
- **Key Tests**:
  - Touch interactions
  - Biometric authentication
  - Offline functionality
  - Push notifications
  - Deep linking

#### Complete User Workflows
- **Location**: `tests/e2e/workflows/`
- **Coverage**: End-to-end user journeys
- **Key Tests**:
  - Signup → Create Note → Sync → Offline
  - Note Classification → PARA Organization
  - Search → Edit → Share → Archive
  - Settings → Backup → Restore

### 5. Security Tests

#### Authentication Bypass Prevention
- **Location**: `tests/security/auth-bypass.test.ts`
- **Coverage**: Auth vulnerabilities, session management
- **Key Tests**:
  - Protected route access
  - Token validation
  - Session fixation prevention
  - Privilege escalation prevention

#### RLS Policy Violations
- **Location**: `tests/security/rls-violations.test.ts`
- **Coverage**: Data access control, policy enforcement
- **Key Tests**:
  - Cross-user data access
  - SQL injection prevention
  - Parameter tampering
  - Policy bypass attempts

#### XSS and Injection Prevention
- **Location**: `tests/security/xss-injection.test.ts`
- **Coverage**: Input sanitization, output encoding
- **Key Tests**:
  - XSS payload detection
  - SQL injection prevention
  - CSRF protection
  - Input validation

#### Encryption Key Handling
- **Location**: `tests/security/encryption.test.ts`
- **Coverage**: Key management, cryptographic security
- **Key Tests**:
  - Key generation security
  - Key storage protection
  - Key rotation
  - Cryptographic vulnerabilities

## Running Tests

### Web Application

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:component
npm run test:e2e
npm run test:security

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run E2E tests with UI
npm run test:e2e:ui
```

### Mobile Application

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:component

# Run E2E tests
npm run test:e2e:build
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Test Configuration

### Jest Configuration

#### Web App (`jest.config.js`)
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

#### Mobile App (`jest.config.js`)
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Playwright Configuration

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json'], ['junit']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
})
```

### Detox Configuration

```javascript
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupFilesAfterEnv: ['<rootDir>/e2e/setup.ts']
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/PARANotes.app',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' }
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_7_API_34' }
    }
  }
}
```

## Mocking Strategy

### MSW (Mock Service Worker)

Used for API mocking in both web and mobile applications:

```typescript
// tests/mocks/handlers.ts
export const handlers = [
  // Auth handlers
  http.post(`${baseUrl}/auth/v1/token`, async ({ request }) => {
    const body = await request.json()
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-token',
        user: createMockUser({ email: body.email }),
      })
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  }),
  
  // Database handlers
  http.get(`${baseUrl}/rest/v1/notes`, () => {
    return HttpResponse.json(createMockNotes())
  }),
  
  // Storage handlers
  http.post(`${baseUrl}/storage/v1/object/attachments/*`, () => {
    return HttpResponse.json({ path: 'mock-file-path' })
  }),
]
```

### Component Mocking

```typescript
// Mock external dependencies
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(() => ({
    getHTML: jest.fn(() => '<p>Test content</p>'),
    setContent: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  })),
  EditorContent: ({ editor }: { editor: any }) => <div data-testid="editor-content">Editor Content</div>,
}))
```

## Coverage Requirements

### Minimum Coverage Thresholds

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **Component Tests**: 85%+ coverage
- **E2E Tests**: Critical user flows covered
- **Security Tests**: All security-critical paths covered

### Coverage Reports

- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:security
```

## Best Practices

### Test Organization

1. **File Naming**: Use descriptive names like `componentName.test.tsx`
2. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
3. **Test Isolation**: Each test should be independent
4. **Mock Management**: Use consistent mocking patterns

### Test Data Management

1. **Factory Functions**: Use `createMockUser()`, `createMockNote()` etc.
2. **Test Fixtures**: Store reusable test data in fixtures
3. **Data Cleanup**: Clean up test data after each test
4. **Realistic Data**: Use realistic test data that matches production

### Performance Testing

1. **Test Timeouts**: Set appropriate timeouts for different test types
2. **Parallel Execution**: Run tests in parallel when possible
3. **Resource Cleanup**: Clean up resources after tests
4. **Memory Management**: Monitor memory usage in long-running tests

### Security Testing

1. **Input Validation**: Test all input validation thoroughly
2. **Authentication**: Test all authentication flows
3. **Authorization**: Test all authorization checks
4. **Data Protection**: Test data encryption and protection

### Maintenance

1. **Regular Updates**: Keep testing dependencies updated
2. **Test Review**: Review tests during code reviews
3. **Refactoring**: Refactor tests when refactoring code
4. **Documentation**: Keep test documentation updated

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Identify and fix unstable tests
2. **Slow Tests**: Optimize test performance
3. **Mock Issues**: Debug mocking problems
4. **Environment Issues**: Fix environment-specific problems

### Debug Tools

1. **Jest Debug**: Use `--detectOpenHandles` for debugging
2. **Playwright Debug**: Use `--debug` flag for E2E debugging
3. **Detox Debug**: Use `--debug-synchronization` for mobile debugging
4. **Coverage Debug**: Use coverage reports to identify gaps

## Conclusion

This comprehensive testing strategy ensures the PARA Notes application is reliable, secure, and maintainable. The multi-layered approach covers all aspects of the application from individual functions to complete user workflows, providing confidence in the application's quality and security.

Regular review and updates of this testing strategy will ensure it continues to meet the application's evolving needs and maintains the highest standards of quality and security.
