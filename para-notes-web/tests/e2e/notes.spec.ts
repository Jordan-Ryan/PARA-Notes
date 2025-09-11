import { test, expect } from '@playwright/test'

test.describe('Notes Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
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

    // Mock notes data
    await page.route('**/rest/v1/notes*', async route => {
      const url = new URL(route.request().url())
      const method = route.request().method()
      
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'note-1',
              title: 'Test Note 1',
              content: 'This is test note 1',
              para_category: 'projects',
              tags: ['test', 'example'],
              is_encrypted: false,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
            {
              id: 'note-2',
              title: 'Test Note 2',
              content: 'This is test note 2',
              para_category: 'areas',
              tags: ['test'],
              is_encrypted: false,
              created_at: '2024-01-02T00:00:00Z',
              updated_at: '2024-01-02T00:00:00Z',
            },
          ]),
        })
      } else if (method === 'POST') {
        const body = await route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'new-note-id',
            ...body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]),
        })
      } else if (method === 'PATCH') {
        const body = await route.request().postDataJSON()
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{
            id: 'note-1',
            title: 'Updated Note',
            content: 'Updated content',
            para_category: 'projects',
            tags: ['test', 'updated'],
            is_encrypted: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString(),
          }]),
        })
      } else if (method === 'DELETE') {
        await route.fulfill({
          status: 204,
          contentType: 'application/json',
          body: '',
        })
      }
    })

    // Sign in and navigate to notes
    await page.goto('/')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await page.getByRole('link', { name: /notes/i }).click()
    await expect(page).toHaveURL('/dashboard/notes')
  })

  test('should display notes list', async ({ page }) => {
    await expect(page.getByText('Test Note 1')).toBeVisible()
    await expect(page.getByText('Test Note 2')).toBeVisible()
    await expect(page.getByText('This is test note 1')).toBeVisible()
    await expect(page.getByText('This is test note 2')).toBeVisible()
  })

  test('should create a new note', async ({ page }) => {
    await page.getByRole('button', { name: /new note/i }).click()
    
    await expect(page).toHaveURL('/dashboard/notes/new')
    await expect(page.getByRole('heading', { name: /new note/i })).toBeVisible()
    
    // Fill in note details
    await page.getByLabel(/title/i).fill('My New Note')
    await page.getByLabel(/content/i).fill('This is my new note content')
    await page.getByLabel(/category/i).selectOption('projects')
    await page.getByLabel(/tags/i).fill('new, test')
    
    // Save the note
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should redirect back to notes list
    await expect(page).toHaveURL('/dashboard/notes')
    await expect(page.getByText('My New Note')).toBeVisible()
  })

  test('should edit an existing note', async ({ page }) => {
    // Click on first note to edit
    await page.getByText('Test Note 1').click()
    
    await expect(page).toHaveURL('/dashboard/notes/note-1')
    await expect(page.getByDisplayValue('Test Note 1')).toBeVisible()
    
    // Update the note
    await page.getByLabel(/title/i).fill('Updated Test Note')
    await page.getByLabel(/content/i).fill('This is updated content')
    
    // Save changes
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should redirect back to notes list
    await expect(page).toHaveURL('/dashboard/notes')
    await expect(page.getByText('Updated Test Note')).toBeVisible()
  })

  test('should delete a note', async ({ page }) => {
    // Click on first note to edit
    await page.getByText('Test Note 1').click()
    
    // Click delete button
    await page.getByRole('button', { name: /delete/i }).click()
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm delete/i }).click()
    
    // Should redirect back to notes list
    await expect(page).toHaveURL('/dashboard/notes')
    await expect(page.getByText('Test Note 1')).not.toBeVisible()
  })

  test('should search notes', async ({ page }) => {
    // Mock search results
    await page.route('**/rest/v1/rpc/search_notes*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'note-1',
            title: 'Test Note 1',
            content: 'This is test note 1',
            para_category: 'projects',
            tags: ['test', 'example'],
            is_encrypted: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ]),
      })
    })

    // Search for notes
    await page.getByPlaceholder(/search notes/i).fill('test')
    await page.getByRole('button', { name: /search/i }).click()
    
    // Should show search results
    await expect(page.getByText('Test Note 1')).toBeVisible()
    await expect(page.getByText('Test Note 2')).not.toBeVisible()
  })

  test('should filter notes by category', async ({ page }) => {
    // Filter by projects
    await page.getByLabel(/category/i).selectOption('projects')
    
    // Should only show project notes
    await expect(page.getByText('Test Note 1')).toBeVisible()
    await expect(page.getByText('Test Note 2')).not.toBeVisible()
    
    // Filter by areas
    await page.getByLabel(/category/i).selectOption('areas')
    
    // Should only show area notes
    await expect(page.getByText('Test Note 1')).not.toBeVisible()
    await expect(page.getByText('Test Note 2')).toBeVisible()
  })

  test('should sort notes by date', async ({ page }) => {
    // Sort by newest first
    await page.getByLabel(/sort by/i).selectOption('updated_at')
    await page.getByLabel(/sort order/i).selectOption('desc')
    
    // Should show newest note first
    const notes = page.locator('[data-testid="note-item"]')
    await expect(notes.first()).toContainText('Test Note 2')
    await expect(notes.last()).toContainText('Test Note 1')
  })

  test('should toggle note encryption', async ({ page }) => {
    // Click on first note to edit
    await page.getByText('Test Note 1').click()
    
    // Toggle encryption
    await page.getByRole('button', { name: /encrypt/i }).click()
    
    // Should show encryption status
    await expect(page.getByText(/encrypted/i)).toBeVisible()
    
    // Save the note
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should redirect back to notes list
    await expect(page).toHaveURL('/dashboard/notes')
    await expect(page.getByText(/encrypted/i)).toBeVisible()
  })

  test('should handle note conflicts', async ({ page }) => {
    // Mock conflict response
    await page.route('**/rest/v1/notes*', async route => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Conflict',
          message: 'Note has been modified by another user',
        }),
      })
    })

    // Click on first note to edit
    await page.getByText('Test Note 1').click()
    
    // Try to save
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should show conflict resolution dialog
    await expect(page.getByText(/conflict detected/i)).toBeVisible()
    await expect(page.getByText(/note has been modified/i)).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/rest/v1/notes*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      })
    })

    // Try to create a new note
    await page.getByRole('button', { name: /new note/i }).click()
    
    // Fill in note details
    await page.getByLabel(/title/i).fill('My New Note')
    await page.getByLabel(/content/i).fill('This is my new note content')
    
    // Try to save
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should show error message
    await expect(page.getByText(/error saving note/i)).toBeVisible()
  })

  test('should handle offline mode', async ({ page }) => {
    // Go offline
    await page.context().setOffline(true)
    
    // Try to create a new note
    await page.getByRole('button', { name: /new note/i }).click()
    
    // Fill in note details
    await page.getByLabel(/title/i).fill('Offline Note')
    await page.getByLabel(/content/i).fill('This note was created offline')
    
    // Should show offline indicator
    await expect(page.getByText(/offline/i)).toBeVisible()
    
    // Save the note (should be queued for sync)
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should show sync pending indicator
    await expect(page.getByText(/sync pending/i)).toBeVisible()
    
    // Go back online
    await page.context().setOffline(false)
    
    // Should start syncing
    await expect(page.getByText(/syncing/i)).toBeVisible()
  })

  test('should handle large notes', async ({ page }) => {
    // Create a note with large content
    await page.getByRole('button', { name: /new note/i }).click()
    
    const largeContent = 'A'.repeat(10000) // 10KB of content
    
    await page.getByLabel(/title/i).fill('Large Note')
    await page.getByLabel(/content/i).fill(largeContent)
    
    // Save the note
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should handle large content without issues
    await expect(page.getByText('Large Note')).toBeVisible()
  })

  test('should handle special characters in notes', async ({ page }) => {
    // Create a note with special characters
    await page.getByRole('button', { name: /new note/i }).click()
    
    const specialContent = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    
    await page.getByLabel(/title/i).fill('Special Note')
    await page.getByLabel(/content/i).fill(specialContent)
    
    // Save the note
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should handle special characters correctly
    await expect(page.getByText('Special Note')).toBeVisible()
  })
})
