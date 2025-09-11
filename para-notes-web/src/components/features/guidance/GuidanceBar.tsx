import React from 'react';
import type { ClassifierResult } from '@/types/guidance';
import { PARA_CATEGORY_LABELS } from '@/constants/para';

type Props = {
  result: ClassifierResult | null;
  onAccept: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
  onDismiss?: () => void;
};

export function GuidanceBar({ result, onAccept, onDismiss }: Props) {
  if (!result?.best) return null;
  const best = result.best;
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
      <div>
        Suggest: {PARA_CATEGORY_LABELS[best.category]} • {(best.confidence.value * 100).toFixed(0)}%
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded bg-black px-3 py-1 text-white" onClick={() => onAccept(best.category)}>Accept</button>
        {onDismiss ? (
          <button className="px-2 py-1" onClick={onDismiss}>Dismiss</button>
        ) : null}
      </div>
    </div>
  );
}


