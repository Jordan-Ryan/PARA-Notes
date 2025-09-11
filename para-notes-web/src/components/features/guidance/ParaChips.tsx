import React from 'react';
import { PARA_CATEGORIES, PARA_CATEGORY_LABELS } from '@/constants/para';

type Props = {
  onSelect: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
};

export function ParaChips({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PARA_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="rounded-full border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
        >
          {PARA_CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}


