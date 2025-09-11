import { create } from 'zustand';
import type { Note } from '@/types/notes';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  pendingChanges: PendingChange[];
  conflicts: Conflict[];
  error: string | null;
}

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'note' | 'paraItem';
  entityId: string;
  data: Partial<Note | any>;
  timestamp: Date;
  retryCount: number;
}

interface Conflict {
  id: string;
  entityType: 'note' | 'paraItem';
  entityId: string;
  localVersion: Note | any;
  remoteVersion: Note | any;
  timestamp: Date;
  resolved: boolean;
}

interface SyncActions {
  setOnline: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  setLastSyncAt: (timestamp: Date | null) => void;
  addPendingChange: (change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>) => void;
  removePendingChange: (id: string) => void;
  updatePendingChange: (id: string, updates: Partial<PendingChange>) => void;
  addConflict: (conflict: Omit<Conflict, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveConflict: (id: string, resolution: 'local' | 'remote' | 'merge') => void;
  setError: (error: string | null) => void;
  clearPendingChanges: () => void;
  clearConflicts: () => void;
  retryPendingChange: (id: string) => void;
}

type SyncStore = SyncState & SyncActions;

export const useSyncStore = create<SyncStore>()((set, get) => ({
  // State
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncAt: null,
  pendingChanges: [],
  conflicts: [],
  error: null,

  // Actions
  setOnline: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setLastSyncAt: (timestamp) => set({ lastSyncAt: timestamp }),
  addPendingChange: (change) => {
    const { pendingChanges } = get();
    const newChange: PendingChange = {
      ...change,
      id: `${change.entityType}-${change.entityId}-${Date.now()}`,
      timestamp: new Date(),
      retryCount: 0,
    };
    set({ pendingChanges: [...pendingChanges, newChange] });
  },
  removePendingChange: (id) => {
    const { pendingChanges } = get();
    set({ pendingChanges: pendingChanges.filter((change) => change.id !== id) });
  },
  updatePendingChange: (id, updates) => {
    const { pendingChanges } = get();
    const updatedChanges = pendingChanges.map((change) =>
      change.id === id ? { ...change, ...updates } : change
    );
    set({ pendingChanges: updatedChanges });
  },
  addConflict: (conflict) => {
    const { conflicts } = get();
    const newConflict: Conflict = {
      ...conflict,
      id: `conflict-${conflict.entityId}-${Date.now()}`,
      timestamp: new Date(),
      resolved: false,
    };
    set({ conflicts: [...conflicts, newConflict] });
  },
  resolveConflict: (id, _resolution) => {
    const { conflicts } = get();
    const updatedConflicts = conflicts.map((conflict) =>
      conflict.id === id ? { ...conflict, resolved: true } : conflict
    );
    set({ conflicts: updatedConflicts });
  },
  setError: (error) => set({ error }),
  clearPendingChanges: () => set({ pendingChanges: [] }),
  clearConflicts: () => set({ conflicts: [] }),
  retryPendingChange: (id) => {
    const { pendingChanges } = get();
    const updatedChanges = pendingChanges.map((change) =>
      change.id === id ? { ...change, retryCount: change.retryCount + 1 } : change
    );
    set({ pendingChanges: updatedChanges });
  },
}));
