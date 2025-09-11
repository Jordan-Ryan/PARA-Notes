import { nanoid } from 'nanoid';
import type { StorageAdapter, QueueAdapter, SyncOperation, SyncEngineOptions, Conflict, MergeResult, SyncEntity, EntityType } from '@/types/sync';
import { supabase } from '@/lib/supabase/client';

const backoff = (attempt: number, initial: number) => Math.min(30000, initial * 2 ** attempt);

export class SyncEngineImpl {
  private storage: StorageAdapter;
  private queue: QueueAdapter;
  private options: Required<SyncEngineOptions>;

  constructor(storage: StorageAdapter, queue: QueueAdapter, options: SyncEngineOptions) {
    this.storage = storage;
    this.queue = queue;
    this.options = {
      pullPageSize: 500,
      maxRetry: 5,
      initialBackoffMs: 500,
      ...options,
    };
  }

  async applyOptimistic<T extends SyncEntity>(op: SyncOperation<T>): Promise<void> {
    const current = await this.storage.get<T>(op.entityType, op.entityId);
    if (current) {
      await this.storage.saveBaseVersion(op.entityType, current);
    }
    if (op.operationType === 'delete') {
      await this.storage.remove(op.entityType, op.entityId);
    } else if (op.data) {
      const updated = { ...(current ?? {}), ...op.data } as T;
      await this.storage.upsert(op.entityType, updated);
    }
    await this.queue.enqueue(op);
  }

  async push(): Promise<void> {
    let attempt = 0;
    for (;;) {
      const op = await this.queue.dequeue();
      if (!op) return;
      try {
        await this.pushOperation(op);
        attempt = 0;
      } catch (error) {
        op.retryCount += 1;
        if (op.retryCount > this.options.maxRetry) {
          const base = await this.storage.getBaseVersion(op.entityType, op.entityId);
          if (base) await this.storage.upsert(op.entityType, base);
          continue;
        }
        await this.queue.enqueue(op);
        await new Promise((r) => setTimeout(r, backoff(attempt++, this.options.initialBackoffMs)));
      }
    }
  }

  private async pushOperation(op: SyncOperation): Promise<void> {
    const table = op.entityType === 'note' ? 'notes' : 'para_items';
    if (op.operationType === 'delete') {
      const { error } = await supabase.from(table).delete().eq('id', op.entityId);
      if (error) throw error;
      return;
    }
    const payload = { ...op.data, id: op.entityId } as Record<string, unknown>;
    const { error } = await supabase.from(table).upsert(payload, { onConflict: 'id' });
    if (error) throw error;
  }

  async pull(sinceVersion?: number): Promise<void> {
    await this.pullEntity('note', sinceVersion);
    await this.pullEntity('paraItem', sinceVersion);
  }

  private async pullEntity(entityType: EntityType, sinceVersion?: number): Promise<void> {
    const table = entityType === 'note' ? 'notes' : 'para_items';
    let cursor = 0;
    for (;;) {
      let query = supabase.from(table).select('*').order('version', { ascending: true }).range(cursor, cursor + this.options.pullPageSize - 1);
      if (sinceVersion && sinceVersion > 0) {
        query = query.gte('version', sinceVersion + 1);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) break;
      for (const row of data) {
        await this.storage.upsert(entityType, row as unknown as SyncEntity);
      }
      if (data.length < this.options.pullPageSize) break;
      cursor += data.length;
    }
  }

  async sync(): Promise<void> {
    await this.push();
    const latestNotes = await this.storage.list('note');
    const latestItems = await this.storage.list('paraItem');
    const maxVersion = Math.max(0, ...latestNotes.map(n => n.version ?? 0), ...latestItems.map(i => i.version ?? 0));
    await this.pull(maxVersion);
  }

  async resolveConflict<T extends SyncEntity>(conflict: Conflict<T>, resolution: MergeResult<T>): Promise<void> {
    if (resolution.resolution === 'local') {
      await this.storage.upsert(conflict.entityType, conflict.local);
    } else if (resolution.resolution === 'remote') {
      await this.storage.upsert(conflict.entityType, conflict.remote);
    } else if (resolution.merged) {
      await this.storage.upsert(conflict.entityType, resolution.merged);
    }
    await this.queue.enqueue({
      id: nanoid(),
      operationType: 'update',
      entityType: conflict.entityType,
      entityId: conflict.entityId,
      data: resolution.merged ?? (resolution.resolution === 'local' ? conflict.local : conflict.remote),
      createdAt: new Date(),
      retryCount: 0,
    });
  }
}


