import type { ClassificationInput, ClassifierResult, GuidanceRuleSet } from '@/types/guidance';
import { useSupabase } from '@/hooks/useSupabase';

// Non-hook function for programmatic calls
export async function serverClassify(
	client: ReturnType<typeof useSupabase>['client'],
	input: ClassificationInput,
	_rules?: Partial<GuidanceRuleSet>,
): Promise<ClassifierResult | null> {
	try {
		const { data, error } = await client.functions.invoke('guidance-classify', { body: { input, rules: _rules } });
		if (error) throw error;
		return data as ClassifierResult;
	} catch (error) {
		console.warn('Server classify failed', error);
		return null;
	}
}


