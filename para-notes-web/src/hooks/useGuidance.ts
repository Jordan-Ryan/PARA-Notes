import { useEffect, useMemo, useState } from 'react';
import type { ClassificationInput, ClassifierResult, GuidanceRuleSet, ParaCategory } from '@/types/guidance';
import { classifyNote, recordUserCorrection } from '@/lib/guidance/paraClassifier';
import { trackGuidanceEvent } from '@/lib/guidance/analytics';
import { createClient } from '@/lib/supabase/client';

function useDebounced<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useGuidance(input: ClassificationInput, options?: { userRules?: Partial<GuidanceRuleSet>; enableServerFallback?: boolean }) {
  const debouncedInput = useDebounced(input);
  const [result, setResult] = useState<ClassifierResult | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const local = await classifyNote(debouncedInput, options?.userRules);
      if (cancelled) return;
      setResult(local);
      if (local.best) {
        trackGuidanceEvent({ name: 'guidance_suggestion_served', timestamp: Date.now(), userId: input.userId || '', noteId: input.noteId || '', properties: { category: local.best.category, confidence: local.best.confidence.value, source: local.best.source } });
      }
      if (options?.enableServerFallback) {
        try {
          const { data } = await supabase.functions.invoke('guidance-classify', { body: { input: debouncedInput, rules: options?.userRules } });
          if (!cancelled && data && data.best && (!local.best || data.best.confidence.value > (local.best?.confidence.value ?? 0))) {
            setResult(data as ClassifierResult);
          }
        } catch {
          // ignore server errors, privacy-first client classification
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [debouncedInput.text, debouncedInput.currentPath, debouncedInput.userId]);

  const accept = useMemo(() => async (category: ParaCategory) => {
    if (!result?.best) return;
    trackGuidanceEvent({ name: 'guidance_suggestion_accepted', timestamp: Date.now(), userId: input.userId || '', noteId: input.noteId || '', properties: { category, confidence: result.best.confidence.value, source: result.best.source } });
    await recordUserCorrection({ userId: input.userId || '', noteId: input.noteId || '', finalCategory: category });
  }, [result?.best, input.userId, input.noteId]);

  const reject = useMemo(() => async (category: ParaCategory) => {
    if (!result?.best) return;
    trackGuidanceEvent({ name: 'guidance_suggestion_rejected', timestamp: Date.now(), userId: input.userId || '', noteId: input.noteId || '', properties: { category, confidence: result.best.confidence.value, source: result.best.source } });
  }, [result?.best, input.userId, input.noteId]);

  return { result, accept, reject };
}


