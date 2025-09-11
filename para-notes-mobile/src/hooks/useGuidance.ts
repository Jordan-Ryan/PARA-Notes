import { useEffect, useMemo, useRef, useState } from 'react';
import type { ClassificationInput, ClassifierResult, GuidanceRuleSet, ParaCategory } from '@/types/guidance';
import { classifyNote, recordUserCorrection } from '@/lib/guidance/paraClassifier';
import { trackGuidanceEvent } from '@/lib/guidance/analytics';
import { useSupabase } from './useSupabase';
import { serverClassify } from '@/lib/guidance/serverFallback';

function useDebounced<T>(value: T, delay = 250): T {
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
	const { client } = useSupabase();
	const inFlight = useRef(0);

	useEffect(() => {
		let cancelled = false;
		async function run() {
			inFlight.current += 1;
			const local = await classifyNote(debouncedInput, options?.userRules);
			if (cancelled) return;
			setResult(local);
			if (local.best) {
				trackGuidanceEvent({ name: 'guidance_suggestion_served', timestamp: Date.now(), userId: input.userId, noteId: input.noteId, properties: { category: local.best.category, confidence: local.best.confidence.value, source: local.best.source } });
			}
			if (options?.enableServerFallback) {
				const remote = await serverClassify(client, debouncedInput, options?.userRules);
				if (!cancelled && remote && remote.best && (!local.best || remote.best.confidence.value > (local.best?.confidence.value ?? 0))) {
					setResult(remote);
				}
			}
			inFlight.current -= 1;
		}
		run();
		return () => {
			cancelled = true;
		};
	}, [debouncedInput.text, debouncedInput.currentPath, debouncedInput.userId]);

	const accept = useMemo(() => async (category: ParaCategory) => {
		if (!result?.best) return;
		trackGuidanceEvent({ name: 'guidance_suggestion_accepted', timestamp: Date.now(), userId: input.userId, noteId: input.noteId, properties: { category, confidence: result.best.confidence.value, source: result.best.source } });
		await recordUserCorrection({ userId: input.userId, noteId: input.noteId, finalCategory: category });
	}, [result?.best, input.userId, input.noteId]);

	const reject = useMemo(() => async (category: ParaCategory) => {
		if (!result?.best) return;
		trackGuidanceEvent({ name: 'guidance_suggestion_rejected', timestamp: Date.now(), userId: input.userId, noteId: input.noteId, properties: { category, confidence: result.best.confidence.value, source: result.best.source } });
	}, [result?.best, input.userId, input.noteId]);

	return { result, accept, reject };
}


