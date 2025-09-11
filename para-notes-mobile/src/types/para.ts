import { ParaCategory, ProjectStatus, ResourceType } from './database';

export interface ParaArea {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ParaProject {
  id: string;
  name: string;
  description?: string;
  area_id?: string;
  area?: ParaArea;
  status: ProjectStatus;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ParaResource {
  id: string;
  name: string;
  description?: string;
  url?: string;
  type: ResourceType;
  created_at: string;
  updated_at: string;
}

export interface ParaGuidance {
  id: string;
  category: ParaCategory;
  title: string;
  content: string;
  tips: string[];
  examples: string[];
  created_at: string;
  updated_at: string;
}

export interface ParaSystem {
  areas: ParaArea[];
  projects: ParaProject[];
  resources: ParaResource[];
  guidance: ParaGuidance[];
}

export interface ParaStats {
  total_areas: number;
  total_projects: number;
  total_resources: number;
  active_projects: number;
  completed_projects: number;
  overdue_projects: number;
}

export interface ParaFilter {
  category?: ParaCategory;
  area_id?: string;
  project_id?: string;
  status?: ProjectStatus;
  type?: ResourceType;
  search?: string;
  tags?: string[];
}

export interface ParaSort {
  field: 'name' | 'created_at' | 'updated_at' | 'due_date';
  direction: 'asc' | 'desc';
}
