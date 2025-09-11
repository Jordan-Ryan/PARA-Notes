import { db } from './db';
import type { QueueAdapter, SyncOperation } from '@/types/sync';

export const indexedDbQueue: QueueAdapter = {
	async enqueue(op) {
		await db.queue.put(op);
	},
	async dequeue() {
		const next = await db.queue.orderBy('createdAt').first();
		if (!next) return null;
		await db.queue.delete(next.id);
		return next as SyncOperation;
	},
	async peekAll() {
		return (await db.queue.orderBy('createdAt').toArray()) as SyncOperation[];
	},
	async remove(id) {
		await db.queue.delete(id);
	},
	async update(id, updates) {
		const existing = await db.queue.get(id);
		if (!existing) return;
		await db.queue.put({ ...existing, ...updates });
	},
	async clear() {
		await db.queue.clear();
	},
};


