import type {
  ClassificationInput,
  ClassifierResult,
  GuidanceSuggestion,
  GuidanceRuleSet,
  ParaCategory,
  GuidanceSignalSource,
} from '@/types/guidance';
import { loadRuleSet, mergeWithUserRules, scoreCategory } from './guidanceRules';

type LearningWeights = Record<string, number>; // key: `${userId}:${category}` -> weight

const LEARNING_KEY = 'para_guidance_learning_v1';

function loadLearning(): LearningWeights {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LEARNING_KEY) : null;
    return raw ? (JSON.parse(raw) as LearningWeights) : {};
  } catch {
    return {};
  }
}

function saveLearning(weights: LearningWeights): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LEARNING_KEY, JSON.stringify(weights));
    }
  } catch {
    /* noop */
  }
}

export async function classifyNote(input: ClassificationInput, userRules?: Partial<GuidanceRuleSet>): Promise<ClassifierResult> {
  const baseRules = await loadRuleSet();
  const rules = mergeWithUserRules(baseRules, userRules);

  const text = input.text || `${input.title ?? ''} ${input.body ?? ''}`;
  const { scores, reasons, matches } = scoreCategory(text, input.currentPath, rules);
  
  // Debug logging in test environment
  if (process.env.NODE_ENV === 'test') {
    console.log('Classification debug:', {
      text,
      rules: rules.keywordRules.map(rule => ({
        id: rule.id,
        category: rule.category,
        keywords: rule.keywords,
        weight: rule.weight
      })),
      scores,
      reasons,
      matches
    });
  }

  const learning = loadLearning();
  const learnedBoost: Record<ParaCategory, number> = { projects: 0, areas: 0, resources: 0, archive: 0 };
  for (const cat of Object.keys(learnedBoost) as ParaCategory[]) {
    const key = `${input.userId ?? 'anon'}:${cat}`;
    if (learning[key]) {
      learnedBoost[cat] += learning[key];
      reasons[cat].push('Learning boost from past corrections');
    }
  }

  const combinedScores: Record<ParaCategory, number> = {
    projects: scores.projects + learnedBoost.projects,
    areas: scores.areas + learnedBoost.areas,
    resources: scores.resources + learnedBoost.resources,
    archive: scores.archive + learnedBoost.archive,
  };

  const maxScore = Math.max(...Object.values(combinedScores));
  const suggestions: GuidanceSuggestion[] = (Object.keys(combinedScores) as ParaCategory[])
    .filter((cat) => combinedScores[cat] > 0)
    .map((cat) => ({
      category: cat,
      confidence: { value: maxScore === 0 ? 0 : combinedScores[cat] / (maxScore || 1), reasons: reasons[cat] },
      source: (matches[cat].length > 0 ? 'keyword' : input.currentPath ? 'context' : 'rule') as GuidanceSignalSource,
      keywordsMatched: matches[cat],
    }))
    .sort((a, b) => b.confidence.value - a.confidence.value);

  return {
    suggestions,
    best: suggestions[0] || { category: 'projects', confidence: { value: 0, reasons: [] }, source: 'rule' as GuidanceSignalSource, keywordsMatched: [] },
    allScores: (Object.keys(combinedScores) as ParaCategory[]).map((cat) => ({
      category: cat,
      score: combinedScores[cat],
      reasons: reasons[cat],
    })),
  };
}

export async function recordUserCorrection(params: {
  userId?: string;
  noteId?: string;
  finalCategory: ParaCategory;
}): Promise<void> {
  const weights = loadLearning();
  const key = `${params.userId ?? 'anon'}:${params.finalCategory}`;
  weights[key] = (weights[key] ?? 0) + 0.25;
  saveLearning(weights);
  queueServerLearningEvent({ userId: params.userId || '', noteId: params.noteId || '', finalCategory: params.finalCategory });
}

function queueServerLearningEvent(evt: { userId?: string; noteId?: string; finalCategory: ParaCategory }): void {
  try {
    const queueKey = 'para_guidance_events_queue_v1';
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(queueKey) : null;
    const arr = raw ? (JSON.parse(raw) as unknown[]) : [];
    arr.push({ ...evt, timestamp: Date.now() });
    if (typeof localStorage !== 'undefined') localStorage.setItem(queueKey, JSON.stringify(arr));
  } catch {
    /* noop */
  }
}


