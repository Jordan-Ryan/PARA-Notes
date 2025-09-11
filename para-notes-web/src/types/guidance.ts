export type ParaCategory = 'projects' | 'areas' | 'resources' | 'archive';

export type GuidanceSignalSource = 'keyword' | 'context' | 'learning' | 'rule' | 'fallback';

export interface ClassificationInput {
  text: string;
  title?: string;
  body?: string;
  currentPath?: string;
  userId?: string;
  noteId?: string;
}

export interface ConfidenceScore {
  value: number;
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
  keywords: string[];
  weight?: number;
};

export type ContextRule = {
  id: string;
  matchPathStartsWith: string;
  category: ParaCategory;
  weight?: number;
};

export interface GuidanceRuleSet {
  keywordRules: KeywordRule[];
  contextRules: ContextRule[];
  userOverrides?: Partial<{
    weights: Record<string, number>;
    disabledRuleIds: string[];
  }>;
}

export interface ClassifierResult {
  suggestions: GuidanceSuggestion[];
  best?: GuidanceSuggestion;
  allScores: Array<{ category: ParaCategory; score: number; reasons: string[] }>;
}

export interface ABTestVariant {
  experiment: string;
  variant: 'A' | 'B' | 'C';
  assignedAt: number;
}

export interface UserGuidanceSettings {
  enabled: boolean;
  enableServerFallback: boolean;
  customRules?: Partial<GuidanceRuleSet>;
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


