import type { ClassificationInput, ClassifierResult, GuidanceRuleSet } from '@/types/guidance';
import { classifyNote } from './paraClassifier';

export async function classifyNotesBulk(
	notes: ClassificationInput[],
	userRules?: Partial<GuidanceRuleSet>,
): Promise<Array<{ input: ClassificationInput; result: ClassifierResult }>> {
	const results = await Promise.all(notes.map(async (n) => ({ input: n, result: await classifyNote(n, userRules) })));
	return results;
}


