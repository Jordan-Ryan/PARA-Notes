import { ParaCategory, ProjectStatus, ResourceType } from '@/types';

export const PARA_CATEGORIES: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];

export const PROJECT_STATUSES: ProjectStatus[] = ['active', 'on_hold', 'completed', 'cancelled'];

export const RESOURCE_TYPES: ResourceType[] = ['book', 'article', 'video', 'podcast', 'website', 'other'];

export const PARA_CATEGORY_LABELS: Record<ParaCategory, string> = {
  projects: 'Projects',
  areas: 'Areas',
  resources: 'Resources',
  archive: 'Archive',
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  book: 'Book',
  article: 'Article',
  video: 'Video',
  podcast: 'Podcast',
  website: 'Website',
  other: 'Other',
};

export const PARA_CATEGORY_COLORS: Record<ParaCategory, string> = {
  projects: '#007AFF',
  areas: '#10B981',
  resources: '#F59E0B',
  archive: '#6B7280',
};

export const PARA_CATEGORY_ICONS: Record<ParaCategory, string> = {
  projects: '📋',
  areas: '🎯',
  resources: '📚',
  archive: '📦',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  active: '#10B981',
  on_hold: '#F59E0B',
  completed: '#6B7280',
  cancelled: '#EF4444',
};

export const RESOURCE_TYPE_ICONS: Record<ResourceType, string> = {
  book: '📖',
  article: '📄',
  video: '🎥',
  podcast: '🎧',
  website: '🌐',
  other: '📎',
};

export const PARA_GUIDANCE = {
  projects: {
    title: 'Projects',
    description: 'Projects are outcomes that require multiple steps and have a deadline.',
    tips: [
      'Break large projects into smaller, manageable tasks',
      'Set clear deadlines and milestones',
      'Review progress regularly',
      'Archive completed projects',
    ],
    examples: [
      'Launch new website by end of quarter',
      'Complete certification course',
      'Plan family vacation',
      'Renovate kitchen',
    ],
  },
  areas: {
    title: 'Areas',
    description: 'Areas are standards you want to maintain over time.',
    tips: [
      'Focus on maintaining standards, not completing tasks',
      'Review regularly to ensure quality',
      'Set up systems and processes',
      'Monitor key metrics',
    ],
    examples: [
      'Health and fitness',
      'Personal relationships',
      'Professional development',
      'Home maintenance',
    ],
  },
  resources: {
    title: 'Resources',
    description: 'Resources are topics you want to reference in the future.',
    tips: [
      'Organize by topic or theme',
      'Add tags for easy searching',
      'Include source information',
      'Review and update regularly',
    ],
    examples: [
      'Useful articles and blog posts',
      'Books and e-books',
      'Videos and tutorials',
      'Tools and software',
    ],
  },
  archive: {
    title: 'Archive',
    description: 'Archive contains inactive items from other categories.',
    tips: [
      'Move completed projects here',
      'Archive outdated resources',
      'Keep for historical reference',
      'Review periodically for cleanup',
    ],
    examples: [
      'Completed projects',
      'Outdated resources',
      'Old notes and documents',
      'Historical records',
    ],
  },
};

export const DEFAULT_PARA_SETTINGS = {
  max_areas: 10,
  max_projects_per_area: 5,
  max_resources: 100,
  auto_archive_days: 90,
  sync_interval: 300000, // 5 minutes
};
