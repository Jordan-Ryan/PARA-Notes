import { createClient } from '@supabase/supabase-js'

// Test configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key'

const supabase = createClient(supabaseUrl, supabaseKey)

describe('Supabase RPC Functions', () => {
  let testUser: any
  let testNote: any
  let testFolder: any

  beforeAll(async () => {
    // Create test user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true,
    })

    if (userError) {
      throw new Error('Failed to create test user')
    }

    testUser = user.user
  })

  afterAll(async () => {
    // Clean up test user
    if (testUser) {
      await supabase.auth.admin.deleteUser(testUser.id)
    }
  })

  beforeEach(async () => {
    // Clean up test data
    await supabase.from('notes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('folders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  })

  describe('create_initial_para_root', () => {
    it('should create initial PARA structure for a user', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Call the RPC function
      const { data: result, error: rpcError } = await supabase
        .rpc('create_initial_para_root')

      expect(rpcError).toBeNull()
      expect(result).toBeDefined()

      // Verify folders were created
      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', testUser.id)

      expect(foldersError).toBeNull()
      expect(folders).toHaveLength(4) // Projects, Areas, Resources, Archive

      const folderNames = folders.map(f => f.name)
      expect(folderNames).toContain('Projects')
      expect(folderNames).toContain('Areas')
      expect(folderNames).toContain('Resources')
      expect(folderNames).toContain('Archive')
    })

    it('should not create duplicate PARA structure', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Call the function twice
      const { data: result1, error: rpcError1 } = await supabase
        .rpc('create_initial_para_root')

      const { data: result2, error: rpcError2 } = await supabase
        .rpc('create_initial_para_root')

      expect(rpcError1).toBeNull()
      expect(rpcError2).toBeNull()

      // Verify only one set of folders was created
      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', testUser.id)

      expect(foldersError).toBeNull()
      expect(folders).toHaveLength(4)
    })
  })

  describe('para_suggest', () => {
    it('should suggest PARA category for a note', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Call the RPC function
      const { data: suggestions, error: rpcError } = await supabase
        .rpc('para_suggest', {
          note_title: 'Project Planning Meeting',
          note_preview: 'Discussing Q1 roadmap and deadlines for the new feature',
        })

      expect(rpcError).toBeNull()
      expect(suggestions).toBeDefined()
      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)

      // Check suggestion structure
      const suggestion = suggestions[0]
      expect(suggestion).toHaveProperty('category')
      expect(suggestion).toHaveProperty('confidence')
      expect(suggestion).toHaveProperty('reasons')
      expect(['projects', 'areas', 'resources', 'archive']).toContain(suggestion.category)
    })

    it('should suggest projects category for project-related content', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Call the RPC function with project-related content
      const { data: suggestions, error: rpcError } = await supabase
        .rpc('para_suggest', {
          note_title: 'Q1 Project Milestones',
          note_preview: 'Deadline: March 31st. Tasks: API development, testing, deployment',
        })

      expect(rpcError).toBeNull()
      expect(suggestions).toBeDefined()

      const projectSuggestion = suggestions.find(s => s.category === 'projects')
      expect(projectSuggestion).toBeDefined()
      expect(projectSuggestion.confidence).toBeGreaterThan(0)
    })

    it('should handle empty input gracefully', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Call the RPC function with empty input
      const { data: suggestions, error: rpcError } = await supabase
        .rpc('para_suggest', {
          note_title: '',
          note_preview: '',
        })

      expect(rpcError).toBeNull()
      expect(suggestions).toBeDefined()
      expect(Array.isArray(suggestions)).toBe(true)
    })
  })

  describe('search_notes', () => {
    beforeEach(async () => {
      // Create test notes
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      const notes = [
        {
          title: 'Project Planning',
          content: 'Meeting notes about Q1 roadmap and deadlines',
          para_category: 'projects',
        },
        {
          title: 'Area Maintenance',
          content: 'Regular maintenance tasks for health and fitness',
          para_category: 'areas',
        },
        {
          title: 'Resource Collection',
          content: 'Useful articles and books about React development',
          para_category: 'resources',
        },
      ]

      for (const note of notes) {
        const { error: insertError } = await supabase
          .from('notes')
          .insert(note)

        expect(insertError).toBeNull()
      }
    })

    it('should search notes by title and content', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Search for project-related notes
      const { data: results, error: rpcError } = await supabase
        .rpc('search_notes', {
          search_query: 'project planning',
        })

      expect(rpcError).toBeNull()
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBeGreaterThan(0)

      // Check that results contain the expected note
      const projectNote = results.find((r: any) => r.title === 'Project Planning')
      expect(projectNote).toBeDefined()
    })

    it('should return empty results for non-matching query', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Search for non-matching content
      const { data: results, error: rpcError } = await supabase
        .rpc('search_notes', {
          search_query: 'nonexistent content',
        })

      expect(rpcError).toBeNull()
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
      expect(results.length).toBe(0)
    })

    it('should handle empty search query', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Search with empty query
      const { data: results, error: rpcError } = await supabase
        .rpc('search_notes', {
          search_query: '',
        })

      expect(rpcError).toBeNull()
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('get_folder_hierarchy', () => {
    beforeEach(async () => {
      // Create initial PARA structure
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      const { error: rpcError } = await supabase
        .rpc('create_initial_para_root')

      expect(rpcError).toBeNull()
    })

    it('should return folder hierarchy for the user', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Get folder hierarchy
      const { data: hierarchy, error: rpcError } = await supabase
        .rpc('get_folder_hierarchy')

      expect(rpcError).toBeNull()
      expect(hierarchy).toBeDefined()
      expect(Array.isArray(hierarchy)).toBe(true)
      expect(hierarchy.length).toBe(4) // Projects, Areas, Resources, Archive

      // Check structure
      const folderNames = hierarchy.map((f: any) => f.name)
      expect(folderNames).toContain('Projects')
      expect(folderNames).toContain('Areas')
      expect(folderNames).toContain('Resources')
      expect(folderNames).toContain('Archive')
    })

    it('should include note counts for each folder', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Get folder hierarchy
      const { data: hierarchy, error: rpcError } = await supabase
        .rpc('get_folder_hierarchy')

      expect(rpcError).toBeNull()
      expect(hierarchy).toBeDefined()

      // Check that each folder has a note_count property
      hierarchy.forEach((folder: any) => {
        expect(folder).toHaveProperty('note_count')
        expect(typeof folder.note_count).toBe('number')
      })
    })
  })

  describe('get_folder_notes_count', () => {
    beforeEach(async () => {
      // Create initial PARA structure and test notes
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      const { error: rpcError } = await supabase
        .rpc('create_initial_para_root')

      expect(rpcError).toBeNull()

      // Get the projects folder
      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('name', 'Projects')
        .single()

      expect(foldersError).toBeNull()
      testFolder = folders

      // Create test notes
      const notes = [
        {
          title: 'Project 1',
          content: 'First project',
          para_category: 'projects',
          folder_id: testFolder.id,
        },
        {
          title: 'Project 2',
          content: 'Second project',
          para_category: 'projects',
          folder_id: testFolder.id,
        },
      ]

      for (const note of notes) {
        const { error: insertError } = await supabase
          .from('notes')
          .insert(note)

        expect(insertError).toBeNull()
      }
    })

    it('should return note count for a specific folder', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Get note count for projects folder
      const { data: count, error: rpcError } = await supabase
        .rpc('get_folder_notes_count', {
          folder_id: testFolder.id,
        })

      expect(rpcError).toBeNull()
      expect(count).toBeDefined()
      expect(typeof count).toBe('number')
      expect(count).toBe(2)
    })

    it('should return 0 for empty folder', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Get areas folder (should be empty)
      const { data: areasFolder, error: areasError } = await supabase
        .from('folders')
        .select('*')
        .eq('name', 'Areas')
        .single()

      expect(areasError).toBeNull()

      // Get note count for areas folder
      const { data: count, error: rpcError } = await supabase
        .rpc('get_folder_notes_count', {
          folder_id: areasFolder.id,
        })

      expect(rpcError).toBeNull()
      expect(count).toBe(0)
    })
  })

  describe('move_note_to_para', () => {
    beforeEach(async () => {
      // Create initial PARA structure
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      const { error: rpcError } = await supabase
        .rpc('create_initial_para_root')

      expect(rpcError).toBeNull()

      // Create a test note
      const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert({
          title: 'Test Note',
          content: 'Test content',
          para_category: 'projects',
        })
        .select()
        .single()

      expect(noteError).toBeNull()
      testNote = note
    })

    it('should move note to different PARA category', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Move note to areas
      const { data: result, error: rpcError } = await supabase
        .rpc('move_note_to_para', {
          note_id: testNote.id,
          new_category: 'areas',
        })

      expect(rpcError).toBeNull()
      expect(result).toBeDefined()

      // Verify note was moved
      const { data: updatedNote, error: selectError } = await supabase
        .from('notes')
        .select('*')
        .eq('id', testNote.id)
        .single()

      expect(selectError).toBeNull()
      expect(updatedNote.para_category).toBe('areas')
    })

    it('should handle invalid note ID', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to move non-existent note
      const { data: result, error: rpcError } = await supabase
        .rpc('move_note_to_para', {
          note_id: '00000000-0000-0000-0000-000000000000',
          new_category: 'areas',
        })

      expect(rpcError).toBeDefined()
    })

    it('should handle invalid category', async () => {
      // Sign in as test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(authError).toBeNull()

      // Try to move to invalid category
      const { data: result, error: rpcError } = await supabase
        .rpc('move_note_to_para', {
          note_id: testNote.id,
          new_category: 'invalid_category',
        })

      expect(rpcError).toBeDefined()
    })
  })
})
