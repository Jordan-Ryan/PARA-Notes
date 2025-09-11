import type { ParaCategory } from '@/types/guidance';

export type Template = {
	id: string;
	title: string;
	description?: string;
	fields: Array<{ key: string; label: string; placeholder?: string }>;
};

const PROJECT_TEMPLATE: Template = {
	id: 'tpl_project_basic',
	title: 'Project Template',
	description: 'Capture outcome, deadline, and next actions.',
	fields: [
		{ key: 'outcome', label: 'Desired Outcome', placeholder: 'What will be true when finished?' },
		{ key: 'deadline', label: 'Deadline', placeholder: 'YYYY-MM-DD' },
		{ key: 'next_actions', label: 'Next Actions', placeholder: 'List 3 concrete steps' },
	],
};

const AREA_TEMPLATE: Template = {
	id: 'tpl_area_basic',
	title: 'Area Template',
	description: 'Define standards and review cadence.',
	fields: [
		{ key: 'standard', label: 'Standard', placeholder: 'What does good look like?' },
		{ key: 'metrics', label: 'Metrics', placeholder: 'How will you measure it?' },
		{ key: 'cadence', label: 'Review Cadence', placeholder: 'Weekly, Monthly, Quarterly' },
	],
};

const RESOURCE_TEMPLATE: Template = {
	id: 'tpl_resource_basic',
	title: 'Resource Template',
	description: 'Capture topic, source, and key insights.',
	fields: [
		{ key: 'topic', label: 'Topic', placeholder: 'What is this about?' },
		{ key: 'source', label: 'Source', placeholder: 'Link or citation' },
		{ key: 'insights', label: 'Key Insights', placeholder: 'What stood out?' },
	],
};

const ARCHIVE_TEMPLATE: Template = {
	id: 'tpl_archive_basic',
	title: 'Archive Template',
	description: 'Capture context for future reference.',
	fields: [
		{ key: 'reason', label: 'Reason Archived', placeholder: 'Why is this inactive?' },
		{ key: 'reference', label: 'Reference Value', placeholder: 'When might this be useful?' },
	],
};

export function getTemplatesForCategory(category: ParaCategory): Template[] {
	switch (category) {
		case 'projects':
			return [PROJECT_TEMPLATE];
		case 'areas':
			return [AREA_TEMPLATE];
		case 'resources':
			return [RESOURCE_TEMPLATE];
		case 'archive':
		default:
			return [ARCHIVE_TEMPLATE];
	}
}


