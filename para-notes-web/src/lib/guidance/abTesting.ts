import type { ABTestVariant } from '@/types/guidance';

const AB_KEY = 'para_guidance_ab_assignments_v1';

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

export function assignVariant(userId: string, experiment = 'guidance_scoring_v1'): ABTestVariant {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(AB_KEY) : null;
    const map = raw ? (JSON.parse(raw) as Record<string, ABTestVariant>) : {};
    const key = `${experiment}:${userId}`;
    if (map[key]) return map[key];
    const h = hashString(key);
    const variants: ABTestVariant['variant'][] = ['A', 'B', 'C'];
    const assigned: ABTestVariant = { experiment, variant: variants[h % variants.length], assignedAt: Date.now() };
    map[key] = assigned;
    if (typeof localStorage !== 'undefined') localStorage.setItem(AB_KEY, JSON.stringify(map));
    return assigned;
  } catch {
    return { experiment, variant: 'A', assignedAt: Date.now() };
  }
}


