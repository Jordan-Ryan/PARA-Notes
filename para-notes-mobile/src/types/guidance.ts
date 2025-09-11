export type ParaCategory = 'projects' | 'areas' | 'resources' | 'archive';

export type GuidanceSignalSource = 'keyword' | 'context' | 'learning' | 'rule' | 'fallback';

export interface ClassificationInput {
	// Raw user text (title + body concatenated or analyzed separately)
	text: string;
	// Optional structured fields
	title?: string;
	body?: string;
	// Current folder path or PARA context (e.g., "areas/health")
	currentPath?: string;
	// User identifier for personalization and A/B testing
	userId?: string;
	// Optional note id for learning feedback linkage
	noteId?: string;
}

export interface ConfidenceScore {
	value: number; // 0..1
	reasons: string[];
}

export interface GuidanceSuggestion {
	category: ParaCategory;
	confidence: ConfidenceScore;
	source: GuidanceSignalSource;
	ruleId?: string;
	keywordsMatched?: string[];
}

export type KeywordRule = {
	id: string;
	category: ParaCategory;
	keywords: string[]; // lowercased tokens
	weight?: number; // default 1.0
};

export type ContextRule = {
	id: string;
	matchPathStartsWith: string; // e.g., "projects/" or "areas/health"
	category: ParaCategory;
	weight?: number;
};

export interface GuidanceRuleSet {
	keywordRules: KeywordRule[];
	contextRules: ContextRule[];
	// per-user overrides
	userOverrides?: Partial<{
		weights: Record<string, number>; // ruleId -> weight
		disabledRuleIds: string[];
	}>;
}

export interface ClassifierResult {
	suggestions: GuidanceSuggestion[];
	best?: GuidanceSuggestion;
	allScores: Array<{ category: ParaCategory; score: number; reasons: string[] }>;
}

export interface ABTestVariant {
	experiment: string; // e.g., "guidance_scoring_v1"
	variant: 'A' | 'B' | 'C';
	assignedAt: number;
}

export interface UserGuidanceSettings {
	enabled: boolean;
	// When true, attempt server-side RPC for complex rules
	enableServerFallback: boolean;
	// Custom user rules merged on top of defaults
	customRules?: Partial<GuidanceRuleSet>;
	// A/B experiments user is enrolled in
	ab?: ABTestVariant[];
}

export interface AnalyticsEventBase {
	name: string;
	timestamp: number;
	userId?: string;
	noteId?: string;
	properties?: Record<string, unknown>;
}

export interface SuggestionServedEvent extends AnalyticsEventBase {
	name: 'guidance_suggestion_served';
	properties: {
		category: ParaCategory;
		confidence: number;
		source: GuidanceSignalSource;
		keywordsMatched?: string[];
		variant?: string;
	};
}

export interface SuggestionAcceptedEvent extends AnalyticsEventBase {
	name: 'guidance_suggestion_accepted';
	properties: {
		category: ParaCategory;
		confidence: number;
		source: GuidanceSignalSource;
		variant?: string;
	};
}

export interface SuggestionRejectedEvent extends AnalyticsEventBase {
	name: 'guidance_suggestion_rejected';
	properties: {
		category: ParaCategory;
		confidence: number;
		source: GuidanceSignalSource;
		variant?: string;
	};
}

export type GuidanceAnalyticsEvent =
	| SuggestionServedEvent
	| SuggestionAcceptedEvent
	| SuggestionRejectedEvent
	| AnalyticsEventBase;


