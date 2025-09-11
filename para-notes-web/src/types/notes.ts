export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'projects' | 'areas' | 'resources' | 'archive';
  paraItemId?: string; // Reference to the PARA item this note belongs to
  tags: string[];
  isEncrypted: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  version: number;
  metadata?: Record<string, unknown>;
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'projects' | 'areas' | 'resources' | 'archive';
  fields: NoteTemplateField[];
  isDefault: boolean;
  userId?: string; // undefined for system templates
}

export interface NoteTemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'multiselect' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
}

export interface NoteSearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  score: number;
  highlights: {
    title: string[];
    content: string[];
  };
}

export interface NoteFilter {
  category?: 'projects' | 'areas' | 'resources' | 'archive';
  tags?: string[];
  isPinned?: boolean;
  isEncrypted?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface NoteSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'relevance';
  direction: 'asc' | 'desc';
}
