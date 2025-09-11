import { createClient } from '@supabase/supabase-js'
import { createMockUser, createMockNote } from '../../utils/test-utils'

// Test configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key'

const supabase = createClient(supabaseUrl, supabaseKey)

describe('Supabase RLS Policies', () => {
  let testUser: any
  let testUser2: any
  let testNote: any

  beforeAll(async () => {
    // Create test users
    const { data: user1, error: user1Error } = await supabase.auth.admin.createUser({
      email: 'test1@example.com',
      password: 'password123',
      email_confirm: true,
    })
    
    const { data: user2, error: user2Error } = await supabase.auth.admin.createUser({
      email: 'test2@example.com',
      password: 'password123',
      email_confirm: true,
    })

    if (user1Error || user2Error) {
      throw new Error('Failed to create test users')
    }

    testUser = user1.user
    testUser2 = user2.user
  })

  afterAll(async () => {
    // Clean up test users
    if (testUser) {
      await supabase.auth.admin.deleteUser(testUser.id)
    }
    if (testUser2) {
      await supabase.auth.admin.deleteUser(testUser2.id)
    }
  })

  beforeEach(async () => {
    // Clean up test data
    await supabase.from('notes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  })

  describe('Notes Table RLS', () => {
    it('should allow users to view their own notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()
      expect(note).toBeDefined()

      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to view the note
      const { data: notes, error: selectError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', note.id)

      expect(selectError).toBeNull()
      expect(notes).toHaveLength(1)
      expect(notes[0].id).toBe(note.id)
    })

    it('should prevent users from viewing other users notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to view the note (should return empty)
      const { data: notes, error: selectError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', note.id)

      expect(selectError).toBeNull()
      expect(notes).toHaveLength(0)
    })

    it('should allow users to insert their own notes', async () => {
      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Insert a note
      const { data: note, error: insertError } = await supabase
        .from('notes')
        .insert({
          title: 'My Test Note',
          content: 'My test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(insertError).toBeNull()
      expect(note).toBeDefined()
      expect(note.user_id).toBe(testUser.id)
    })

    it('should prevent users from inserting notes for other users', async () => {
      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to insert a note with different user_id
      const { data: note, error: insertError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser2.id, // Different user
          title: 'Hacked Note',
          content: 'This should fail',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(insertError).toBeDefined()
      expect(insertError.message).toContain('permission denied')
    })

    it('should allow users to update their own notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Update the note
      const { data: updatedNote, error: updateError } = await supabase
        .from('notes')
        .update({
          title: 'Updated Note',
          content: 'Updated content',
        })
        .eq('id', note.id)
        .select()
        .single()

      expect(updateError).toBeNull()
      expect(updatedNote.title).toBe('Updated Note')
    })

    it('should prevent users from updating other users notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to update the note
      const { data: updatedNote, error: updateError } = await supabase
        .from('notes')
        .update({
          title: 'Hacked Update',
          content: 'This should fail',
        })
        .eq('id', note.id)
        .select()
        .single()

      expect(updateError).toBeDefined()
      expect(updateError.message).toContain('permission denied')
    })

    it('should allow users to delete their own notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Delete the note
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      expect(deleteError).toBeNull()

      // Verify note is deleted
      const { data: notes, error: selectError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', note.id)

      expect(selectError).toBeNull()
      expect(notes).toHaveLength(0)
    })

    it('should prevent users from deleting other users notes', async () => {
      // Create a note for testUser
      const { data: note, error: createError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to delete the note
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      expect(deleteError).toBeDefined()
      expect(deleteError.message).toContain('permission denied')
    })
  })

  describe('Folders Table RLS', () => {
    it('should allow users to view their own folders', async () => {
      // Create a folder for testUser
      const { data: folder, error: createError } = await supabase
        .from('folders')
        .insert({
          user_id: testUser.id,
          name: 'Test Folder',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // View the folder
      const { data: folders, error: selectError } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folder.id)

      expect(selectError).toBeNull()
      expect(folders).toHaveLength(1)
      expect(folders[0].id).toBe(folder.id)
    })

    it('should prevent users from viewing other users folders', async () => {
      // Create a folder for testUser
      const { data: folder, error: createError } = await supabase
        .from('folders')
        .insert({
          user_id: testUser.id,
          name: 'Test Folder',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to view the folder (should return empty)
      const { data: folders, error: selectError } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folder.id)

      expect(selectError).toBeNull()
      expect(folders).toHaveLength(0)
    })
  })

  describe('Attachments Table RLS', () => {
    it('should allow users to view their own attachments', async () => {
      // Create a note first
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(noteError).toBeNull()

      // Create an attachment
      const { data: attachment, error: createError } = await supabase
        .from('attachments')
        .insert({
          note_id: note.id,
          filename: 'test.pdf',
          content_type: 'application/pdf',
          size: 1024,
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test1@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // View the attachment
      const { data: attachments, error: selectError } = await supabase
        .from('attachments')
        .select('*')
        .eq('id', attachment.id)

      expect(selectError).toBeNull()
      expect(attachments).toHaveLength(1)
      expect(attachments[0].id).toBe(attachment.id)
    })

    it('should prevent users from viewing other users attachments', async () => {
      // Create a note for testUser
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert({
          user_id: testUser.id,
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(noteError).toBeNull()

      // Create an attachment
      const { data: attachment, error: createError } = await supabase
        .from('attachments')
        .insert({
          note_id: note.id,
          filename: 'test.pdf',
          content_type: 'application/pdf',
          size: 1024,
        })
        .select()
        .single()

      expect(createError).toBeNull()

      // Sign in as testUser2
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test2@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to view the attachment (should return empty)
      const { data: attachments, error: selectError } = await supabase
        .from('attachments')
        .select('*')
        .eq('id', attachment.id)

      expect(selectError).toBeNull()
      expect(attachments).toHaveLength(0)
    })
  })

  describe('Unauthenticated Access', () => {
    it('should prevent unauthenticated access to notes', async () => {
      // Sign out
      await supabase.auth.signOut()

      // Try to view notes
      const { data: notes, error: selectError } = await supabase
        .from('notes')
        .select('*')

      expect(selectError).toBeDefined()
      expect(selectError.message).toContain('permission denied')
    })

    it('should prevent unauthenticated access to folders', async () => {
      // Sign out
      await supabase.auth.signOut()

      // Try to view folders
      const { data: folders, error: selectError } = await supabase
        .from('folders')
        .select('*')

      expect(selectError).toBeDefined()
      expect(selectError.message).toContain('permission denied')
    })
  })
})
