const { device, expect, element, by, waitFor } = require('detox')
const { login, logout } = require('./setup')

describe('Authentication Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should display login screen on app launch', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible()
    await expect(element(by.id('email-input'))).toBeVisible()
    await expect(element(by.id('password-input'))).toBeVisible()
    await expect(element(by.id('login-button'))).toBeVisible()
  })

  it('should show validation errors for empty form', async () => {
    await element(by.id('login-button')).tap()
    
    await expect(element(by.text('Email is required'))).toBeVisible()
    await expect(element(by.text('Password is required'))).toBeVisible()
  })

  it('should show validation error for invalid email', async () => {
    await element(by.id('email-input')).typeText('invalid-email')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('login-button')).tap()
    
    await expect(element(by.text('Invalid email format'))).toBeVisible()
  })

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('test@example.com')
    await element(by.id('password-input')).typeText('wrong-password')
    await element(by.id('login-button')).tap()
    
    await expect(element(by.text('Invalid credentials'))).toBeVisible()
  })

  it('should successfully login with valid credentials', async () => {
    await login()
    
    await expect(element(by.id('dashboard'))).toBeVisible()
    await expect(element(by.text('Welcome'))).toBeVisible()
  })

  it('should navigate to signup screen', async () => {
    await element(by.id('signup-link')).tap()
    
    await expect(element(by.id('signup-screen'))).toBeVisible()
    await expect(element(by.id('full-name-input'))).toBeVisible()
    await expect(element(by.id('confirm-password-input'))).toBeVisible()
  })

  it('should successfully signup with valid information', async () => {
    await element(by.id('signup-link')).tap()
    
    await element(by.id('email-input')).typeText('newuser@example.com')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('confirm-password-input')).typeText('password123')
    await element(by.id('full-name-input')).typeText('New User')
    await element(by.id('signup-button')).tap()
    
    await expect(element(by.id('dashboard'))).toBeVisible()
  })

  it('should show error for password mismatch during signup', async () => {
    await element(by.id('signup-link')).tap()
    
    await element(by.id('email-input')).typeText('newuser@example.com')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('confirm-password-input')).typeText('different-password')
    await element(by.id('full-name-input')).typeText('New User')
    await element(by.id('signup-button')).tap()
    
    await expect(element(by.text('Passwords do not match'))).toBeVisible()
  })

  it('should navigate to forgot password screen', async () => {
    await element(by.id('forgot-password-link')).tap()
    
    await expect(element(by.id('forgot-password-screen'))).toBeVisible()
    await expect(element(by.id('reset-email-input'))).toBeVisible()
  })

  it('should successfully request password reset', async () => {
    await element(by.id('forgot-password-link')).tap()
    
    await element(by.id('reset-email-input')).typeText('test@example.com')
    await element(by.id('send-reset-button')).tap()
    
    await expect(element(by.text('Password reset email sent'))).toBeVisible()
  })

  it('should logout successfully', async () => {
    await login()
    await logout()
    
    await expect(element(by.id('login-screen'))).toBeVisible()
  })

  it('should persist authentication state across app restarts', async () => {
    await login()
    
    // Terminate and relaunch app
    await device.terminateApp()
    await device.launchApp()
    
    // Should still be authenticated
    await expect(element(by.id('dashboard'))).toBeVisible()
  })

  it('should handle biometric authentication', async () => {
    // Enable biometric authentication
    await element(by.id('biometric-toggle')).tap()
    
    await login()
    await logout()
    
    // Try to login with biometrics
    await element(by.id('biometric-login-button')).tap()
    
    // Should authenticate and show dashboard
    await expect(element(by.id('dashboard'))).toBeVisible()
  })

  it('should handle network errors gracefully', async () => {
    // Simulate network error
    await device.setURLBlacklist(['.*'])
    
    await element(by.id('email-input')).typeText('test@example.com')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('login-button')).tap()
    
    await expect(element(by.text('Network error'))).toBeVisible()
    
    // Restore network
    await device.clearURLBlacklist()
  })

  it('should handle offline mode', async () => {
    // Go offline
    await device.setURLBlacklist(['.*'])
    
    await element(by.id('email-input')).typeText('test@example.com')
    await element(by.id('password-input')).typeText('password123')
    await element(by.id('login-button')).tap()
    
    await expect(element(by.text('Offline mode'))).toBeVisible()
    
    // Restore network
    await device.clearURLBlacklist()
  })

  it('should prevent access to protected screens without authentication', async () => {
    // Try to navigate to protected screen
    await device.launchApp({ url: 'para-notes://dashboard' })
    
    // Should redirect to login
    await expect(element(by.id('login-screen'))).toBeVisible()
  })

  it('should handle deep links with authentication', async () => {
    await login()
    
    // Test deep link to specific note
    await device.launchApp({ url: 'para-notes://note/123' })
    
    await expect(element(by.id('note-editor'))).toBeVisible()
  })

  it('should handle session expiration', async () => {
    await login()
    
    // Simulate session expiration
    await device.setURLBlacklist(['.*auth.*'])
    
    // Try to perform authenticated action
    await element(by.id('new-note-button')).tap()
    
    // Should redirect to login
    await expect(element(by.id('login-screen'))).toBeVisible()
  })
})
