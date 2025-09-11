import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login form on initial visit', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL('/signup')
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('wrong-password')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test('should successfully sign in with valid credentials', async ({ page }) => {
    // Mock successful authentication
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        }),
      })
    })

    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should successfully sign up with valid information', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Mock successful signup
    await page.route('**/auth/v1/signup*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'test-user-id',
            email: 'newuser@example.com',
            user_metadata: {},
          },
        }),
      })
    })

    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByLabel(/full name/i).fill('New User')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should show error for password mismatch during signup', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click()
    
    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('different-password')
    await page.getByLabel(/full name/i).fill('New User')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should handle forgot password flow', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click()
    
    // Mock successful password reset request
    await page.route('**/auth/v1/recover*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password reset email sent' }),
      })
    })

    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /send reset email/i }).click()
    
    await expect(page.getByText(/password reset email sent/i)).toBeVisible()
  })

  test('should handle password reset with valid token', async ({ page }) => {
    await page.goto('/reset-password?token=valid-token')
    
    // Mock successful password reset
    await page.route('**/auth/v1/verify*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Token is valid' }),
      })
    })

    await page.getByLabel(/new password/i).fill('newpassword123')
    await page.getByLabel(/confirm new password/i).fill('newpassword123')
    await page.getByRole('button', { name: /reset password/i }).click()
    
    await expect(page.getByText(/password reset successfully/i)).toBeVisible()
  })

  test('should handle password reset with invalid token', async ({ page }) => {
    await page.goto('/reset-password?token=invalid-token')
    
    // Mock invalid token response
    await page.route('**/auth/v1/verify*', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid or expired token' }),
      })
    })

    await expect(page.getByText(/invalid or expired token/i)).toBeVisible()
  })

  test('should sign out successfully', async ({ page }) => {
    // First sign in
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        }),
      })
    })

    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Mock successful sign out
    await page.route('**/auth/v1/logout*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    // Sign out
    await page.getByRole('button', { name: /sign out/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should persist authentication state across page refreshes', async ({ page }) => {
    // Mock successful authentication
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {},
          },
        }),
      })
    })

    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be authenticated
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should redirect to dashboard when already authenticated', async ({ page }) => {
    // Mock existing session
    await page.route('**/auth/v1/user*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: {},
        }),
      })
    })

    await page.goto('/')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})
