import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ParaItem, Project, Area, Resource, ArchiveItem, ParaCategory } from '@/types/para';

interface ParaState {
  items: ParaItem[];
  projects: Project[];
  areas: Area[];
  resources: Resource[];
  archive: ArchiveItem[];
  selectedItem: ParaItem | null;
  selectedCategory: ParaCategory | null;
  isLoading: boolean;
  error: string | null;
}

interface ParaActions {
  setItems: (items: ParaItem[]) => void;
  addItem: (item: ParaItem) => void;
  updateItem: (id: string, updates: Partial<ParaItem>) => void;
  deleteItem: (id: string) => void;
  setSelectedItem: (item: ParaItem | null) => void;
  setSelectedCategory: (category: ParaCategory | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearItems: () => void;
  archiveItem: (id: string, reason: string) => void;
  unarchiveItem: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  markAsRead: (id: string) => void;
  setRating: (id: string, rating: number) => void;
}

type ParaStore = ParaState & ParaActions;

export const useParaStore = create<ParaStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      projects: [],
      areas: [],
      resources: [],
      archive: [],
      selectedItem: null,
      selectedCategory: null,
      isLoading: false,
      error: null,

      // Actions
      setItems: (items) => {
        const projects = items.filter((item): item is Project => item.category === 'projects');
        const areas = items.filter((item): item is Area => item.category === 'areas');
        const resources = items.filter((item): item is Resource => item.category === 'resources');
        const archive = items.filter((item): item is ArchiveItem => item.category === 'archive');
        
        set({ 
          items, 
          projects, 
          areas, 
          resources, 
          archive,
          error: null 
        });
      },
      addItem: (item) => {
        const { items } = get();
        const updatedItems = [item, ...items];
        get().setItems(updatedItems);
      },
      updateItem: (id, updates) => {
        const { items } = get();
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
        );
        get().setItems(updatedItems);
      },
      deleteItem: (id) => {
        const { items, selectedItem } = get();
        const updatedItems = items.filter((item) => item.id !== id);
        get().setItems(updatedItems);
        if (selectedItem?.id === id) {
          set({ selectedItem: null });
        }
      },
      setSelectedItem: (item) => set({ selectedItem: item }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearItems: () => set({ 
        items: [], 
        projects: [], 
        areas: [], 
        resources: [], 
        archive: [], 
        selectedItem: null 
      }),
      archiveItem: (id, reason) => {
        const { items } = get();
        const item = items.find((item) => item.id === id);
        if (item) {
          const archivedItem: ArchiveItem = {
            ...item,
            category: 'archive',
            archivedAt: new Date(),
            reason,
            originalCategory: item.category,
            status: 'archived',
          };
          get().updateItem(id, archivedItem);
        }
      },
      unarchiveItem: (id) => {
        const { archive } = get();
        const item = archive.find((item) => item.id === id);
        if (item && item.originalCategory) {
          const unarchivedItem = {
            ...item,
            category: item.originalCategory,
            status: 'active' as const,
            archivedAt: undefined,
            reason: undefined,
            originalCategory: undefined,
          };
          get().updateItem(id, unarchivedItem);
        }
      },
      updateProgress: (id, progress) => {
        get().updateItem(id, { progress: Math.max(0, Math.min(100, progress)) });
      },
      markAsRead: (id) => {
        get().updateItem(id, { isRead: true });
      },
      setRating: (id, rating) => {
        get().updateItem(id, { rating: Math.max(1, Math.min(5, rating)) });
      },
    }),
    {
      name: 'para-store',
      partialize: (state) => ({
        items: state.items,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);
