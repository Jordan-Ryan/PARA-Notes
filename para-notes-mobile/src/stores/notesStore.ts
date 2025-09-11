import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note, NoteFilter, NoteSort } from '@/types/notes'

interface NotesState {
  notes: Note[]
  selectedNote: Note | null
  filter: NoteFilter
  sort: NoteSort
  searchQuery: string
  isLoading: boolean
  error: string | null
}

interface NotesActions {
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSelectedNote: (note: Note | null) => void
  setFilter: (filter: Partial<NoteFilter>) => void
  setSort: (sort: NoteSort) => void
  setSearchQuery: (query: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearNotes: () => void
  togglePin: (id: string) => void
  toggleEncryption: (id: string) => void
}

type NotesStore = NotesState & NotesActions

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // State
      notes: [],
      selectedNote: null,
      filter: {},
      sort: { field: 'updatedAt', direction: 'desc' },
      searchQuery: '',
      isLoading: false,
      error: null,

      // Actions
      setNotes: (notes) => set({ notes, error: null }),
      addNote: (note) => {
        const { notes } = get()
        set({ notes: [note, ...notes] })
      },
      updateNote: (id, updates) => {
        const { notes } = get()
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
        )
        set({ notes: updatedNotes })
      },
      deleteNote: (id) => {
        const { notes, selectedNote } = get()
        const updatedNotes = notes.filter((note) => note.id !== id)
        set({
          notes: updatedNotes,
          selectedNote: selectedNote?.id === id ? null : selectedNote,
        })
      },
      setSelectedNote: (note) => set({ selectedNote: note }),
      setFilter: (filter) => {
        const { filter: currentFilter } = get()
        set({ filter: { ...currentFilter, ...filter } })
      },
      setSort: (sort) => set({ sort }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearNotes: () => set({ notes: [], selectedNote: null }),
      togglePin: (id) => {
        const { notes } = get()
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, is_pinned: !note.is_pinned } : note
        )
        set({ notes: updatedNotes })
      },
      toggleEncryption: (id) => {
        const { notes } = get()
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, is_encrypted: !note.is_encrypted } : note
        )
        set({ notes: updatedNotes })
      },
    }),
    {
      name: 'notes-store',
      partialize: (state) => ({
        notes: state.notes,
        filter: state.filter,
        sort: state.sort,
      }),
    }
  )
)
