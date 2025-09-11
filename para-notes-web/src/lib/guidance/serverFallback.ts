import type { ClassificationInput, ClassifierResult, GuidanceRuleSet } from '@/types/guidance';
import { createClient } from '@/lib/supabase/client';

export async function serverClassify(input: ClassificationInput, rules?: Partial<GuidanceRuleSet>): Promise<ClassifierResult | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('guidance-classify', { body: { input, rules } });
    if (error) throw error;
    return data as ClassifierResult;
  } catch (error) {
    console.warn('Server classify failed', error);
    return null;
  }
}


