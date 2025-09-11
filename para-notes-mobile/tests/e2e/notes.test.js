const { device, expect, element, by, waitFor } = require('detox')
const { login, createNote, searchNotes, logout } = require('./setup')

describe('Notes Management', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
    await login()
  })

  it('should display notes list on dashboard', async () => {
    await expect(element(by.id('notes-list'))).toBeVisible()
    await expect(element(by.text('Test Note 1'))).toBeVisible()
    await expect(element(by.text('Test Note 2'))).toBeVisible()
  })

  it('should create a new note', async () => {
    await createNote('My New Note', 'This is my new note content', 'projects')
    
    await expect(element(by.text('My New Note'))).toBeVisible()
    await expect(element(by.text('This is my new note content'))).toBeVisible()
  })

  it('should edit an existing note', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await expect(element(by.id('note-editor'))).toBeVisible()
    await expect(element(by.id('note-title-input'))).toHaveText('Test Note 1')
    
    // Update the note
    await element(by.id('note-title-input')).clearText()
    await element(by.id('note-title-input')).typeText('Updated Test Note')
    await element(by.id('note-content-input')).clearText()
    await element(by.id('note-content-input')).typeText('Updated content')
    
    await element(by.id('save-note-button')).tap()
    
    await expect(element(by.text('Updated Test Note'))).toBeVisible()
  })

  it('should delete a note', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('delete-note-button')).tap()
    await element(by.text('Confirm Delete')).tap()
    
    await expect(element(by.text('Test Note 1'))).not.toBeVisible()
  })

  it('should search notes', async () => {
    await searchNotes('test')
    
    await expect(element(by.text('Test Note 1'))).toBeVisible()
    await expect(element(by.text('Test Note 2'))).toBeVisible()
  })

  it('should filter notes by category', async () => {
    await element(by.id('category-filter')).tap()
    await element(by.text('Projects')).tap()
    
    await expect(element(by.text('Test Note 1'))).toBeVisible()
    await expect(element(by.text('Test Note 2'))).not.toBeVisible()
  })

  it('should sort notes by date', async () => {
    await element(by.id('sort-button')).tap()
    await element(by.text('Newest First')).tap()
    
    // Check that notes are sorted correctly
    const notes = await element(by.id('notes-list')).getAttributes()
    expect(notes.children[0].label).toContain('Test Note 2')
  })

  it('should toggle note encryption', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('encrypt-button')).tap()
    
    await expect(element(by.text('Encrypted'))).toBeVisible()
    
    await element(by.id('save-note-button')).tap()
    
    await expect(element(by.text('Encrypted'))).toBeVisible()
  })

  it('should handle note conflicts', async () => {
    await element(by.text('Test Note 1')).tap()
    
    // Simulate conflict
    await device.setURLBlacklist(['.*notes.*'])
    
    await element(by.id('note-title-input')).clearText()
    await element(by.id('note-title-input')).typeText('Conflicting Title')
    await element(by.id('save-note-button')).tap()
    
    await expect(element(by.text('Conflict detected'))).toBeVisible()
    await expect(element(by.text('Note has been modified by another user'))).toBeVisible()
  })

  it('should handle offline mode', async () => {
    // Go offline
    await device.setURLBlacklist(['.*'])
    
    await element(by.id('new-note-button')).tap()
    
    await element(by.id('note-title-input')).typeText('Offline Note')
    await element(by.id('note-content-input')).typeText('This note was created offline')
    await element(by.id('save-note-button')).tap()
    
    await expect(element(by.text('Offline'))).toBeVisible()
    await expect(element(by.text('Sync pending'))).toBeVisible()
  })

  it('should sync notes when coming back online', async () => {
    // Go offline
    await device.setURLBlacklist(['.*'])
    
    await createNote('Offline Note', 'This note was created offline')
    
    // Go back online
    await device.clearURLBlacklist()
    
    await expect(element(by.text('Syncing'))).toBeVisible()
    await expect(element(by.text('Sync complete'))).toBeVisible()
  })

  it('should handle large notes', async () => {
    const largeContent = 'A'.repeat(10000) // 10KB of content
    
    await createNote('Large Note', largeContent)
    
    await expect(element(by.text('Large Note'))).toBeVisible()
  })

  it('should handle special characters in notes', async () => {
    const specialContent = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    
    await createNote('Special Note', specialContent)
    
    await expect(element(by.text('Special Note'))).toBeVisible()
  })

  it('should handle note attachments', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('attach-button')).tap()
    await element(by.text('Take Photo')).tap()
    
    // Simulate camera permission and photo capture
    await device.grantPermissions(['camera'])
    
    await expect(element(by.text('Photo attached'))).toBeVisible()
  })

  it('should handle note sharing', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('share-button')).tap()
    
    await expect(element(by.text('Share Note'))).toBeVisible()
    await expect(element(by.text('Export as PDF'))).toBeVisible()
    await expect(element(by.text('Export as Markdown'))).toBeVisible()
  })

  it('should handle note templates', async () => {
    await element(by.id('new-note-button')).tap()
    
    await element(by.id('template-button')).tap()
    await element(by.text('Meeting Notes')).tap()
    
    await expect(element(by.text('Meeting Notes Template'))).toBeVisible()
  })

  it('should handle note tags', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('tags-input')).typeText('important, urgent')
    await element(by.id('add-tag-button')).tap()
    
    await expect(element(by.text('important'))).toBeVisible()
    await expect(element(by.text('urgent'))).toBeVisible()
  })

  it('should handle note reminders', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('reminder-button')).tap()
    await element(by.text('Set Reminder')).tap()
    
    // Set reminder for tomorrow
    await element(by.id('reminder-date-picker')).tap()
    await element(by.text('Tomorrow')).tap()
    
    await expect(element(by.text('Reminder set'))).toBeVisible()
  })

  it('should handle note collaboration', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('collaborate-button')).tap()
    await element(by.id('invite-input')).typeText('collaborator@example.com')
    await element(by.id('send-invite-button')).tap()
    
    await expect(element(by.text('Invitation sent'))).toBeVisible()
  })

  it('should handle note version history', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('history-button')).tap()
    
    await expect(element(by.text('Version History'))).toBeVisible()
    await expect(element(by.text('Version 1'))).toBeVisible()
  })

  it('should handle note export', async () => {
    await element(by.text('Test Note 1')).tap()
    
    await element(by.id('export-button')).tap()
    await element(by.text('Export as PDF')).tap()
    
    await expect(element(by.text('Exporting'))).toBeVisible()
    await expect(element(by.text('Export complete'))).toBeVisible()
  })

  it('should handle note import', async () => {
    await element(by.id('import-button')).tap()
    
    await element(by.text('Import from File')).tap()
    
    await expect(element(by.text('Select File'))).toBeVisible()
  })

  it('should handle note backup and restore', async () => {
    await element(by.id('profile-tab')).tap()
    
    await element(by.id('backup-button')).tap()
    
    await expect(element(by.text('Backup created'))).toBeVisible()
    
    await element(by.id('restore-button')).tap()
    
    await expect(element(by.text('Restore complete'))).toBeVisible()
  })
})
