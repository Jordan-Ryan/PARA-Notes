import type { GuidanceRuleSet, KeywordRule, ContextRule, ParaCategory } from '@/types/guidance';
import { DEFAULT_PARA_SETTINGS } from '@/constants/config';

const DEFAULT_KEYWORD_RULES: KeywordRule[] = [
	{ id: 'kw_deadline_project', category: 'projects', keywords: ['deadline', 'due', 'by ', 'milestone', 'deliverable', 'launch', 'ship'], weight: 1.2 },
	{ id: 'kw_schedule_project', category: 'projects', keywords: ['schedule', 'timeline', 'gantt', 'sprint'], weight: 1.0 },
	{ id: 'kw_policy_area', category: 'areas', keywords: ['policy', 'standard', 'procedure', 'maintenance', 'review cadence', 'kpi', 'metric'], weight: 1.2 },
	{ id: 'kw_habit_area', category: 'areas', keywords: ['habit', 'routine', 'weekly', 'monthly', 'ongoing'], weight: 1.0 },
	{ id: 'kw_reference_resource', category: 'resources', keywords: ['reference', 'notes', 'bookmark', 'article', 'book', 'research', 'resources'], weight: 1.2 },
	{ id: 'kw_done_archive', category: 'archive', keywords: ['completed', 'finished', 'obsolete', 'outdated', 'no longer needed'], weight: 1.1 },
];

const DEFAULT_CONTEXT_RULES: ContextRule[] = [
	{ id: 'ctx_projects_root', matchPathStartsWith: 'projects/', category: 'projects', weight: 1.1 },
	{ id: 'ctx_areas_root', matchPathStartsWith: 'areas/', category: 'areas', weight: 1.1 },
	{ id: 'ctx_resources_root', matchPathStartsWith: 'resources/', category: 'resources', weight: 1.1 },
	{ id: 'ctx_archive_root', matchPathStartsWith: 'archive/', category: 'archive', weight: 1.1 },
];

export function getDefaultRuleSet(): GuidanceRuleSet {
	return {
		keywordRules: DEFAULT_KEYWORD_RULES,
		contextRules: DEFAULT_CONTEXT_RULES,
	};
}

const STORAGE_KEY = 'para_guidance_rules_v1';

export async function loadRuleSet(): Promise<GuidanceRuleSet> {
	try {
		const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
		if (raw) return JSON.parse(raw) as GuidanceRuleSet;
		return getDefaultRuleSet();
	} catch (error) {
		console.warn('Failed to load guidance rules; using defaults', error);
		return getDefaultRuleSet();
	}
}

export async function saveRuleSet(rules: GuidanceRuleSet): Promise<void> {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
		}
	} catch (error) {
		console.warn('Failed to save guidance rules', error);
	}
}

export function mergeWithUserRules(base: GuidanceRuleSet, user?: Partial<GuidanceRuleSet>): GuidanceRuleSet {
	if (!user) return base;
	return {
		keywordRules: [...base.keywordRules, ...(user.keywordRules ?? [])],
		contextRules: [...base.contextRules, ...(user.contextRules ?? [])],
		userOverrides: user.userOverrides ?? base.userOverrides,
	};
}

export function scoreCategory(
	text: string,
	currentPath: string | undefined,
	rules: GuidanceRuleSet,
): { scores: Record<ParaCategory, number>; reasons: Record<ParaCategory, string[]>; matches: Record<ParaCategory, string[]> } {
	const scores: Record<ParaCategory, number> = { projects: 0, areas: 0, resources: 0, archive: 0 };
	const reasons: Record<ParaCategory, string[]> = { projects: [], areas: [], resources: [], archive: [] };
	const matches: Record<ParaCategory, string[]> = { projects: [], areas: [], resources: [], archive: [] };

	const lowered = text.toLowerCase();
	for (const rule of rules.keywordRules) {
		if (rules.userOverrides?.disabledRuleIds?.includes(rule.id)) continue;
		const weight = rules.userOverrides?.weights?.[rule.id] ?? rule.weight ?? 1.0;
		for (const kw of rule.keywords) {
			if (lowered.includes(kw.toLowerCase())) {
				scores[rule.category] += weight;
				matches[rule.category].push(kw);
				reasons[rule.category].push(`Matched keyword "${kw}" (rule ${rule.id})`);
			}
		}
	}

	if (currentPath) {
		const pathLower = currentPath.toLowerCase();
		for (const ctx of rules.contextRules) {
			if (rules.userOverrides?.disabledRuleIds?.includes(ctx.id)) continue;
			const weight = rules.userOverrides?.weights?.[ctx.id] ?? ctx.weight ?? 1.0;
			if (pathLower.startsWith(ctx.matchPathStartsWith.toLowerCase())) {
				scores[ctx.category] += weight;
				reasons[ctx.category].push(`Context path starts with "${ctx.matchPathStartsWith}" (rule ${ctx.id})`);
			}
		}
	}

	return { scores, reasons, matches };
}


