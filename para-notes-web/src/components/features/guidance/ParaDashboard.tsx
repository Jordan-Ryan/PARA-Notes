import React from 'react';
import { computeAreaReviewReminders } from '@/lib/guidance/reminders';

type Props = {
  counts: { projects: number; areas: number; resources: number; archive: number };
  areas: Array<{ id: string; name: string; lastReviewedAt?: number }>;
};

export function ParaDashboard({ counts, areas }: Props) {
  const reminders = computeAreaReviewReminders(areas);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded border p-4">
        <div className="mb-2 font-semibold">Category Health</div>
        <ul className="space-y-1 text-sm">
          <li>Projects: {counts.projects}</li>
          <li>Areas: {counts.areas}</li>
          <li>Resources: {counts.resources}</li>
          <li>Archive: {counts.archive}</li>
        </ul>
      </div>
      <div className="rounded border p-4">
        <div className="mb-2 font-semibold">Area Review Reminders</div>
        <ul className="space-y-2 text-sm">
          {reminders.map((r) => (
            <li key={r.areaId} className="flex items-center justify-between">
              <span>{r.areaName}</span>
              <span className="text-gray-600">{new Date(r.recommendedNextReviewAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


