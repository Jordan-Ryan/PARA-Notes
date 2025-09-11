import type { Note } from '@/types/notes';
import type { ParaItem } from '@/types/para';

export type EntityType = 'note' | 'paraItem';

export interface EntityBase {
	id: string;
	updatedAt: Date;
	version: number;
	userId: string;
}

export type SyncEntity = Note | ParaItem;

export type OperationType = 'create' | 'update' | 'delete';

export interface SyncOperation<T extends SyncEntity = SyncEntity> {
	id: string;
	operationType: OperationType;
	entityType: EntityType;
	entityId: string;
	data: Partial<T> | null;
	createdAt: Date;
	retryCount: number;
}

export interface Conflict<T extends SyncEntity = SyncEntity> {
	id: string;
	entityType: EntityType;
	entityId: string;
	base: T; // version both sides branched from
	local: T;
	remote: T;
	createdAt: Date;
}

export interface MergeResult<T extends SyncEntity = SyncEntity> {
	resolution: 'local' | 'remote' | 'merged';
	merged?: T;
}

export interface Delta<T extends SyncEntity = SyncEntity> {
	entityType: EntityType;
	entityId: string;
	versionFrom: number;
	versionTo: number;
	patch: Partial<T>;
}

export interface StorageAdapter {
	get<T extends SyncEntity>(entityType: EntityType, id: string): Promise<T | null>;
	list<T extends SyncEntity>(entityType: EntityType): Promise<T[]>;
	listSinceVersion<T extends SyncEntity>(entityType: EntityType, version: number): Promise<T[]>;
	upsert<T extends SyncEntity>(entityType: EntityType, entity: T): Promise<void>;
	remove(entityType: EntityType, id: string): Promise<void>;
	getBaseVersion<T extends SyncEntity>(entityType: EntityType, id: string): Promise<T | null>;
	saveBaseVersion<T extends SyncEntity>(entityType: EntityType, entity: T): Promise<void>;
}

export interface QueueAdapter {
	enqueue(op: SyncOperation): Promise<void>;
	dequeue(): Promise<SyncOperation | null>;
	peekAll(): Promise<SyncOperation[]>;
	remove(id: string): Promise<void>;
	update(id: string, updates: Partial<SyncOperation>): Promise<void>;
	clear(): Promise<void>;
}

export interface SyncEngineOptions {
	userId: string;
	pullPageSize?: number;
	maxRetry?: number;
	initialBackoffMs?: number;
}

export interface SyncEngine {
	push(): Promise<void>;
	pull(sinceVersion?: number): Promise<void>;
	sync(): Promise<void>;
	applyOptimistic<T extends SyncEntity>(op: SyncOperation<T>): Promise<void>;
	resolveConflict<T extends SyncEntity>(conflict: Conflict<T>, resolution: MergeResult<T>): Promise<void>;
}


