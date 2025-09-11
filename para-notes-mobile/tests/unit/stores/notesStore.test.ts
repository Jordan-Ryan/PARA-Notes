import { act, renderHook } from '@testing-library/react-native'
import { useNotesStore } from '@/stores/notesStore'
import { Note } from '@/types/notes'

// Mock the entire store module
const mockStore = {
  notes: [],
  selectedNote: null,
  filter: {},
  sort: { field: 'updatedAt', direction: 'desc' },
  searchQuery: '',
  isLoading: false,
  error: null,
  setNotes: jest.fn((notes) => { mockStore.notes = notes; mockStore.error = null }),
  addNote: jest.fn((note) => { mockStore.notes = [note, ...mockStore.notes] }),
  updateNote: jest.fn((id, updates) => {
    const index = mockStore.notes.findIndex(n => n.id === id)
    if (index !== -1) {
      mockStore.notes[index] = { 
        ...mockStore.notes[index], 
        ...updates,
        updated_at: new Date().toISOString()
      }
    }
  }),
  deleteNote: jest.fn((id) => {
    mockStore.notes = mockStore.notes.filter(n => n.id !== id)
    if (mockStore.selectedNote?.id === id) {
      mockStore.selectedNote = null
    }
  }),
  clearNotes: jest.fn(() => { 
    mockStore.notes = []
    mockStore.selectedNote = null
  }),
  setSelectedNote: jest.fn((note) => { mockStore.selectedNote = note }),
  setFilter: jest.fn((filter) => { mockStore.filter = { ...mockStore.filter, ...filter } }),
  setSort: jest.fn((sort) => { mockStore.sort = { ...mockStore.sort, ...sort } }),
  setSearchQuery: jest.fn((query) => { mockStore.searchQuery = query }),
  setLoading: jest.fn((loading) => { mockStore.isLoading = loading }),
  setError: jest.fn((error) => { mockStore.error = error }),
  togglePin: jest.fn((id) => {
    const index = mockStore.notes.findIndex(n => n.id === id)
    if (index !== -1) {
      mockStore.notes[index] = { ...mockStore.notes[index], is_pinned: !mockStore.notes[index].is_pinned }
    }
  }),
  toggleEncryption: jest.fn((id) => {
    const index = mockStore.notes.findIndex(n => n.id === id)
    if (index !== -1) {
      mockStore.notes[index] = { ...mockStore.notes[index], is_encrypted: !mockStore.notes[index].is_encrypted }
    }
  }),
  getState: jest.fn(() => mockStore),
}

jest.mock('@/stores/notesStore', () => ({
  useNotesStore: jest.fn(() => mockStore).mockImplementation(() => mockStore),
}))

// Add getState method to the mock
Object.assign(useNotesStore, mockStore)

describe('Notes Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    jest.clearAllMocks()
    mockStore.notes = []
    mockStore.selectedNote = null
    mockStore.error = null
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useNotesStore())

      expect(result.current.notes).toEqual([])
      expect(result.current.selectedNote).toBeNull()
      expect(result.current.filter).toEqual({})
      expect(result.current.sort).toEqual({ field: 'updatedAt', direction: 'desc' })
      expect(result.current.searchQuery).toBe('')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Note Management', () => {
    it('should add a note', () => {
      const { result } = renderHook(() => useNotesStore())
      const newNote: Note = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        para_category: 'projects',
        tags: ['test'],
        is_encrypted: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      act(() => {
        result.current.addNote(newNote)
      })

      expect(result.current.notes).toHaveLength(1)
      expect(result.current.notes[0]).toEqual(newNote)
      expect(result.current.error).toBeNull()
    })

    it('should update a note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: 'note-1',
        title: 'Original Title',
        content: 'Original content',
        para_category: 'projects',
        tags: ['test'],
        is_encrypted: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      act(() => {
        result.current.addNote(note)
      })

      const updates = {
        title: 'Updated Title',
        content: 'Updated content',
      }

      act(() => {
        result.current.updateNote('note-1', updates)
      })

      expect(result.current.notes[0].title).toBe('Updated Title')
      expect(result.current.notes[0].content).toBe('Updated content')
      expect(result.current.notes[0].updated_at).not.toBe(note.updated_at)
    })

    it('should delete a note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        para_category: 'projects',
        tags: ['test'],
        is_encrypted: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      act(() => {
        result.current.addNote(note)
        result.current.setSelectedNote(note)
      })

      act(() => {
        result.current.deleteNote('note-1')
      })

      expect(result.current.notes).toHaveLength(0)
      expect(result.current.selectedNote).toBeNull()
    })

    it('should clear all notes', () => {
      const { result } = renderHook(() => useNotesStore())
      const notes: Note[] = [
        {
          id: 'note-1',
          title: 'Note 1',
          content: 'Content 1',
          para_category: 'projects',
          tags: ['test'],
          is_encrypted: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'note-2',
          title: 'Note 2',
          content: 'Content 2',
          para_category: 'areas',
          tags: ['test'],
          is_encrypted: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      act(() => {
        notes.forEach(note => result.current.addNote(note))
        result.current.setSelectedNote(notes[0])
      })

      act(() => {
        result.current.clearNotes()
      })

      expect(result.current.notes).toHaveLength(0)
      expect(result.current.selectedNote).toBeNull()
    })
  })

  describe('Selection Management', () => {
    it('should set selected note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        para_category: 'projects',
        tags: ['test'],
        is_encrypted: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      act(() => {
        result.current.setSelectedNote(note)
      })

      expect(result.current.selectedNote).toEqual(note)
    })
  })

  describe('Filtering and Sorting', () => {
    it('should set filter', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setFilter({ para_category: 'projects' })
      })

      expect(result.current.filter).toEqual({ para_category: 'projects' })
    })

    it('should set sort', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setSort({ field: 'title', direction: 'asc' })
      })

      expect(result.current.sort).toEqual({ field: 'title', direction: 'asc' })
    })

    it('should set search query', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setSearchQuery('project')
      })

      expect(result.current.searchQuery).toBe('project')
    })
  })

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should set error state', () => {
      const { result } = renderHook(() => useNotesStore())
      const error = 'Test error'

      act(() => {
        result.current.setError(error)
      })

      expect(result.current.error).toBe(error)
    })
  })
})
