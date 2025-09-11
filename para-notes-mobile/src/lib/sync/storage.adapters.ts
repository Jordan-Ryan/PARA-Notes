import { openDatabaseSync } from 'expo-sqlite';
import type { StorageAdapter } from '@/types/sync';
import type { Note } from '@/types/notes';
import type { ParaItem } from '@/types/para';

const db = openDatabaseSync('para_notes.db');

db.execSync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    category TEXT,
    paraItemId TEXT,
    tags TEXT,
    isEncrypted INTEGER,
    isPinned INTEGER,
    createdAt TEXT,
    updatedAt TEXT,
    userId TEXT,
    version INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_notes_version ON notes(version);
  CREATE TABLE IF NOT EXISTS para_items (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    parentId TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    userId TEXT,
    version INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_para_items_version ON para_items(version);
  CREATE TABLE IF NOT EXISTS base_versions (
    entityType TEXT,
    entityId TEXT,
    entity TEXT,
    PRIMARY KEY (entityType, entityId)
  );
`);

function rowToJson(row: any) {
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    isEncrypted: !!row.isEncrypted,
    isPinned: !!row.isPinned,
    createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
  };
}

export const sqliteStorage: StorageAdapter = {
  async get(entityType, id) {
    const table = entityType === 'note' ? 'notes' : 'para_items';
    const res = db.getFirstSync(`SELECT * FROM ${table} WHERE id=?`, [id]);
    return res ? rowToJson(res) : null;
  },
  async list(entityType) {
    const table = entityType === 'note' ? 'notes' : 'para_items';
    const res = db.getAllSync(`SELECT * FROM ${table}`);
    return res.map(rowToJson);
  },
  async listSinceVersion(entityType, version) {
    const table = entityType === 'note' ? 'notes' : 'para_items';
    const res = db.getAllSync(`SELECT * FROM ${table} WHERE version > ?`, [version]);
    return res.map(rowToJson);
  },
  async upsert(entityType, entity: any) {
    if (entityType === 'note') {
      const n = entity as Note;
      db.runSync(
        `INSERT OR REPLACE INTO notes (id,title,content,category,paraItemId,tags,isEncrypted,isPinned,createdAt,updatedAt,userId,version)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          n.id,
          n.title,
          n.content,
          n.category,
          n.paraItemId ?? null,
          JSON.stringify(n.tags ?? []),
          n.isEncrypted ? 1 : 0,
          n.isPinned ? 1 : 0,
          n.createdAt?.toISOString?.() ?? null,
          n.updatedAt?.toISOString?.() ?? null,
          n.userId,
          n.version ?? 0,
        ]
      );
    } else {
      const p = entity as ParaItem;
      db.runSync(
        `INSERT OR REPLACE INTO para_items (id,name,type,parentId,createdAt,updatedAt,userId,version)
         VALUES (?,?,?,?,?,?,?,?)`,
        [
          p.id,
          (p as any).name ?? null,
          (p as any).type ?? null,
          (p as any).parentId ?? null,
          (p as any).createdAt?.toISOString?.() ?? null,
          (p as any).updatedAt?.toISOString?.() ?? null,
          (p as any).userId ?? null,
          (p as any).version ?? 0,
        ]
      );
    }
  },
  async remove(entityType, id) {
    const table = entityType === 'note' ? 'notes' : 'para_items';
    db.runSync(`DELETE FROM ${table} WHERE id=?`, [id]);
  },
  async getBaseVersion(entityType, id) {
    const res = db.getFirstSync(`SELECT entity FROM base_versions WHERE entityType=? AND entityId=?`, [entityType, id]);
    return res?.entity ? JSON.parse(res.entity) : null;
  },
  async saveBaseVersion(entityType, entity: any) {
    db.runSync(`INSERT OR REPLACE INTO base_versions (entityType, entityId, entity) VALUES (?,?,?)`, [entityType, entity.id, JSON.stringify(entity)]);
  },
};


