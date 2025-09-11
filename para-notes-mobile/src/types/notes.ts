import { ParaCategory } from './database';

export interface Note {
  id: string;
  title: string;
  content: string;
  para_category: ParaCategory;
  para_area?: string;
  para_project?: string;
  para_resource?: string;
  tags: string[];
  is_encrypted: boolean;
  created_at: string;
  updated_at: string;
  synced_at?: string;
}

export interface NoteDraft {
  id?: string;
  title: string;
  content: string;
  para_category: ParaCategory;
  para_area?: string;
  para_project?: string;
  para_resource?: string;
  tags: string[];
  is_encrypted: boolean;
  is_draft: boolean;
  last_saved?: string;
}

export interface NoteAttachment {
  id: string;
  note_id: string;
  type: 'image' | 'audio' | 'file';
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface NoteSearchResult {
  id: string;
  title: string;
  content: string;
  para_category: ParaCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
  relevance_score: number;
}

export interface NoteFilter {
  category?: ParaCategory;
  area?: string;
  project?: string;
  resource?: string;
  tags?: string[];
  search?: string;
  is_encrypted?: boolean;
  date_from?: string;
  date_to?: string;
}

export interface NoteSort {
  field: 'title' | 'created_at' | 'updated_at' | 'relevance';
  direction: 'asc' | 'desc';
}

export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  para_category: ParaCategory;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteStats {
  total_notes: number;
  notes_by_category: Record<ParaCategory, number>;
  notes_by_area: Record<string, number>;
  notes_by_project: Record<string, number>;
  total_tags: number;
  encrypted_notes: number;
  recent_notes: number;
}
