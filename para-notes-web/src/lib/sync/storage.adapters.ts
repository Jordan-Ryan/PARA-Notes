import { db } from './db';
import type { StorageAdapter } from '@/types/sync';

const tableFor = (entityType: 'note' | 'paraItem') => {
	return entityType === 'note' ? db.notes : db.paraItems;
};

export const indexedDbStorage: StorageAdapter = {
  async get(entityType, id) {
          return (await tableFor(entityType).get(id) || null) as any;
  },

	async list(entityType) {
		return await tableFor(entityType).toArray() as any;
	},

	async listSinceVersion(entityType, version) {
		return await tableFor(entityType).where('version').above(version).toArray() as any;
	},

	async upsert(entityType, entity) {
		await tableFor(entityType).put(entity as any);
	},

	async remove(entityType, id) {
		await tableFor(entityType).delete(id);
	},

	async getBaseVersion(entityType, id) {
		const record = await db.baseVersions.get([entityType, id]);
		return (record?.entity as any) ?? null;
	},

	async saveBaseVersion(entityType, entity) {
		await db.baseVersions.put({ entityType, entityId: entity.id, entity });
	},
};


