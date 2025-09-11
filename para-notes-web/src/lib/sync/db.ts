import Dexie, { Table } from 'dexie';
import type { Note } from '@/types/notes';
import type { ParaItem } from '@/types/para';
import type { EntityType, SyncOperation } from '@/types/sync';

export interface BaseVersion<T> {
	entityType: EntityType;
	entityId: string;
	entity: T;
}

export class SyncDexieDB extends Dexie {
	notes!: Table<Note, string>;
	paraItems!: Table<ParaItem, string>;
	baseVersions!: Table<BaseVersion<unknown>, [EntityType, string]>;
	queue!: Table<SyncOperation, string>;
	meta!: Table<{ key: string; value: unknown }, string>;

	constructor() {
		super('para_notes_sync');
		this.version(1).stores({
			notes: 'id, userId, updatedAt, version',
			paraItems: 'id, userId, updatedAt, version',
			baseVersions: '[entityType+entityId]',
			queue: 'id, entityType, entityId, createdAt, operationType, retryCount',
			meta: 'key',
		});
	}
}

export const db = new SyncDexieDB();


