export type ParaCategory = 'projects' | 'areas' | 'resources' | 'archive';

export interface ParaItem {
  id: string;
  title: string;
  description?: string;
  category: ParaCategory;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface Project extends ParaItem {
  category: 'projects';
  deadline?: Date;
  progress: number; // 0-100
  parentAreaId?: string;
  nextActions: string[];
  waitingFor?: string;
}

export interface Area extends ParaItem {
  category: 'areas';
  standards: string[];
  reviewFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastReviewed?: Date;
}

export interface Resource extends ParaItem {
  category: 'resources';
  url?: string;
  type: 'article' | 'book' | 'video' | 'course' | 'tool' | 'other';
  author?: string;
  source?: string;
  isRead: boolean;
  rating?: number; // 1-5
}

export interface ArchiveItem extends ParaItem {
  category: 'archive';
  archivedAt: Date;
  reason: string;
  originalCategory: ParaCategory;
}

export interface ParaGuidance {
  id: string;
  category: ParaCategory;
  title: string;
  description: string;
  questions: string[];
  examples: string[];
  tips: string[];
}

export interface ParaTemplate {
  id: string;
  category: ParaCategory;
  name: string;
  description: string;
  fields: TemplateField[];
  isDefault: boolean;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'multiselect' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
}
