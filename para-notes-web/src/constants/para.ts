import type { ParaCategory, ParaGuidance } from '@/types/para';

export const PARA_CATEGORIES: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];

export const PARA_CATEGORY_LABELS: Record<ParaCategory, string> = {
  projects: 'Projects',
  areas: 'Areas',
  resources: 'Resources',
  archive: 'Archive',
};

export const PARA_CATEGORY_DESCRIPTIONS: Record<ParaCategory, string> = {
  projects: 'Things with a deadline and a specific outcome',
  areas: 'Standards you want to maintain over time',
  resources: 'Topics or themes of ongoing interest',
  archive: 'Inactive items from the other categories',
};

export const PARA_CATEGORY_COLORS: Record<ParaCategory, string> = {
  projects: 'para-projects',
  areas: 'para-areas',
  resources: 'para-resources',
  archive: 'para-archive',
};

export const PARA_GUIDANCE: Record<ParaCategory, ParaGuidance> = {
  projects: {
    id: 'projects-guidance',
    category: 'projects',
    title: 'Projects',
    description: 'Things with a deadline and a specific outcome',
    questions: [
      'What is the specific outcome you want to achieve?',
      'What is the deadline for this project?',
      'What are the next actions needed to move this forward?',
      'What are you waiting for from others?',
    ],
    examples: [
      'Launch new website by March 15th',
      'Complete quarterly report by Friday',
      'Plan family vacation for summer',
      'Learn Spanish conversation skills',
    ],
    tips: [
      'Keep projects focused on specific outcomes',
      'Set realistic deadlines',
      'Break large projects into smaller milestones',
      'Review progress regularly',
    ],
  },
  areas: {
    id: 'areas-guidance',
    category: 'areas',
    title: 'Areas',
    description: 'Standards you want to maintain over time',
    questions: [
      'What standards do you want to maintain?',
      'How will you know if you\'re succeeding?',
      'What are the key activities to maintain this area?',
      'How often should you review this area?',
    ],
    examples: [
      'Health and Fitness',
      'Financial Management',
      'Professional Development',
      'Home Maintenance',
    ],
    tips: [
      'Focus on maintaining standards, not completing tasks',
      'Set up regular review cycles',
      'Define clear success metrics',
      'Keep areas broad enough to be meaningful',
    ],
  },
  resources: {
    id: 'resources-guidance',
    category: 'resources',
    title: 'Resources',
    description: 'Topics or themes of ongoing interest',
    questions: [
      'What topics are you interested in learning about?',
      'What resources help you stay informed?',
      'How do you want to organize this information?',
      'What makes this resource valuable to you?',
    ],
    examples: [
      'Technology Trends',
      'Investment Strategies',
      'Cooking Techniques',
      'Travel Destinations',
    ],
    tips: [
      'Focus on topics that genuinely interest you',
      'Organize by theme rather than urgency',
      'Review and prune regularly',
      'Keep resources easily accessible',
    ],
  },
  archive: {
    id: 'archive-guidance',
    category: 'archive',
    title: 'Archive',
    description: 'Inactive items from the other categories',
    questions: [
      'Why did this item become inactive?',
      'Is there any value in keeping this?',
      'When might you want to reference this again?',
      'Should this be deleted instead?',
    ],
    examples: [
      'Completed projects',
      'Outdated resources',
      'Areas no longer relevant',
      'Old notes and references',
    ],
    tips: [
      'Archive rather than delete when in doubt',
      'Include context about why it was archived',
      'Review archive periodically for cleanup',
      'Keep archive organized for easy searching',
    ],
  },
};

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'high', label: 'High', color: 'text-red-500' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'text-green-500' },
  { value: 'completed', label: 'Completed', color: 'text-blue-500' },
  { value: 'archived', label: 'Archived', color: 'text-gray-500' },
] as const;
