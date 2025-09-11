import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0]?.use || {}
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Wait for the application to be ready
    await page.goto(baseURL!, { waitUntil: 'networkidle' })
    
    // Check if the application is running
    await page.waitForSelector('body', { timeout: 10000 })
    
    console.log('✅ Application is running and ready for testing')
  } catch (error) {
    console.error('❌ Application failed to start:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
