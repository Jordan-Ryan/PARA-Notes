import { db } from './db';
import type { StorageAdapter } from '@/types/sync';
import type { Note } from '@/types/notes';
import type { ParaItem } from '@/types/para';

const tableFor = (entityType: 'note' | 'paraItem') => {
	return entityType === 'note' ? db.notes : db.paraItems;
};

export const indexedDbStorage: StorageAdapter = {
	async get(entityType, id) {
		// @ts-expect-error runtime table mapping
		return await tableFor(entityType).get(id);
	},

	async list(entityType) {
		// @ts-expect-error runtime table mapping
		return await tableFor(entityType).toArray();
	},

	async listSinceVersion(entityType, version) {
		// @ts-expect-error runtime table mapping
		return await tableFor(entityType).where('version').above(version).toArray();
	},

	async upsert(entityType, entity) {
		// @ts-expect-error runtime table mapping
		await tableFor(entityType).put(entity);
	},

	async remove(entityType, id) {
		// @ts-expect-error runtime table mapping
		await tableFor(entityType).delete(id);
	},

	async getBaseVersion(entityType, id) {
		const record = await db.baseVersions.get([entityType, id]);
		return (record?.entity as Note | ParaItem | null) ?? null;
	},

	async saveBaseVersion(entityType, entity) {
		await db.baseVersions.put({ entityType, entityId: entity.id, entity });
	},
};


