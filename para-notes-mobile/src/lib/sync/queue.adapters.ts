import { MMKV } from 'react-native-mmkv';
import type { QueueAdapter, SyncOperation } from '@/types/sync';

const storage = new MMKV({ id: 'sync-queue' });
const KEY = 'queue';

function readQueue(): SyncOperation[] {
  const json = storage.getString(KEY);
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}
function writeQueue(items: SyncOperation[]) {
  storage.set(KEY, JSON.stringify(items));
}

export const mmkvQueue: QueueAdapter = {
  async enqueue(op) {
    const items = readQueue();
    items.push(op);
    writeQueue(items);
  },
  async dequeue() {
    const items = readQueue();
    const first = items.shift();
    writeQueue(items);
    return first ?? null;
  },
  async peekAll() {
    return readQueue();
  },
  async remove(id) {
    const items = readQueue().filter(i => i.id !== id);
    writeQueue(items);
  },
  async update(id, updates) {
    const items = readQueue().map(i => i.id === id ? { ...i, ...updates } : i);
    writeQueue(items);
  },
  async clear() {
    writeQueue([]);
  },
};


