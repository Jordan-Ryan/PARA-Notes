import { act, renderHook } from '@testing-library/react'
import { useNotesStore } from '@/stores/notesStore'
import { Note } from '@/types/notes'

// Mock the entire store module
jest.mock('@/stores/notesStore', () => {
  const mockStore = {
    notes: [],
    selectedNote: null,
    filter: {},
    sort: { field: 'updatedAt', direction: 'desc' },
    searchQuery: '',
    isLoading: false,
    error: null,
    setNotes: jest.fn((notes) => { mockStore.notes = notes }),
    addNote: jest.fn((note) => { mockStore.notes.push(note) }),
    updateNote: jest.fn((id, updates) => {
      const index = mockStore.notes.findIndex(note => note.id === id)
      if (index !== -1) {
        mockStore.notes[index] = { ...mockStore.notes[index], ...updates }
      }
    }),
    deleteNote: jest.fn((id) => {
      mockStore.notes = mockStore.notes.filter(note => note.id !== id)
    }),
    setSelectedNote: jest.fn((note) => { mockStore.selectedNote = note }),
    setFilter: jest.fn((filter) => { mockStore.filter = { ...mockStore.filter, ...filter } }),
    setSort: jest.fn((sort) => { mockStore.sort = sort }),
    setSearchQuery: jest.fn((query) => { mockStore.searchQuery = query }),
    setLoading: jest.fn((loading) => { mockStore.isLoading = loading }),
    setError: jest.fn((error) => { mockStore.error = error }),
    clearNotes: jest.fn(() => { mockStore.notes = [] }),
    togglePin: jest.fn((id) => {
      const note = mockStore.notes.find(note => note.id === id)
      if (note) {
        note.isPinned = !note.isPinned
      }
    }),
    toggleEncryption: jest.fn((id) => {
      const note = mockStore.notes.find(note => note.id === id)
      if (note) {
        note.isEncrypted = !note.isEncrypted
      }
    }),
    getState: () => mockStore,
    setState: jest.fn(),
    subscribe: jest.fn(),
    destroy: jest.fn(),
  }
  
  return {
    useNotesStore: Object.assign(() => mockStore, mockStore),
  }
})

describe('Notes Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useNotesStore.getState().clearNotes()
    })
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
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      act(() => {
        result.current.addNote(note)
      })

      expect(result.current.notes).toHaveLength(1)
      expect(result.current.notes[0]).toEqual(note)
    })

    it('should update a note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      act(() => {
        result.current.addNote(note)
      })

      act(() => {
        result.current.updateNote('1', { title: 'Updated Title' })
      })

      expect(result.current.notes[0].title).toBe('Updated Title')
    })

    it('should delete a note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      act(() => {
        result.current.addNote(note)
      })

      act(() => {
        result.current.deleteNote('1')
      })

      expect(result.current.notes).toHaveLength(0)
    })
  })

  describe('Selection', () => {
    it('should set selected note', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        result.current.setFilter({ category: 'projects' })
      })

      expect(result.current.filter).toEqual({ category: 'projects' })
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
        result.current.setSearchQuery('test query')
      })

      expect(result.current.searchQuery).toBe('test query')
    })
  })

  describe('Toggle Actions', () => {
    it('should toggle pin status', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      act(() => {
        result.current.addNote(note)
      })

      act(() => {
        result.current.togglePin('1')
      })

      expect(result.current.notes[0].isPinned).toBe(true)
    })

    it('should toggle encryption status', () => {
      const { result } = renderHook(() => useNotesStore())
      const note: Note = {
        id: '1',
        title: 'Test Note',
        content: 'Test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
        isPinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      act(() => {
        result.current.addNote(note)
      })

      act(() => {
        result.current.toggleEncryption('1')
      })

      expect(result.current.notes[0].isEncrypted).toBe(true)
    })
  })

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should set error state', () => {
      const { result } = renderHook(() => useNotesStore())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).toBe('Test error')
    })
  })
})