import { FullConfig } from '@playwright/test'

async function globalTeardown(_config: FullConfig) {
  console.log('🧹 Cleaning up after E2E tests...')
  
  // Add any cleanup logic here
  // For example, cleaning up test data, stopping services, etc.
  
  console.log('✅ E2E test cleanup completed')
}

export default globalTeardown
