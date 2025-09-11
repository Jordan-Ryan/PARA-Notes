import React from 'react';
import { PARA_CATEGORIES, PARA_CATEGORY_DESCRIPTIONS, PARA_CATEGORY_LABELS } from '@/constants/para';

type Props = {
  open: boolean;
  onClose: () => void;
  onMove: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
};

export function MoveNoteModal({ open, onClose, onMove }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
        <div className="mb-3 text-lg font-medium">Move Note</div>
        <div className="space-y-2">
          {PARA_CATEGORIES.map((cat) => (
            <button key={cat} className="w-full rounded border p-3 text-left hover:bg-gray-50" onClick={() => onMove(cat)}>
              <div className="font-semibold">{PARA_CATEGORY_LABELS[cat]}</div>
              <div className="text-sm text-gray-600">{PARA_CATEGORY_DESCRIPTIONS[cat]}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-1" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


