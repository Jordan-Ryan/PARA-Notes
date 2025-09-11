export type AreaReviewReminder = {
  areaId: string;
  areaName: string;
  lastReviewedAt?: number;
  recommendedNextReviewAt: number;
};

export function computeAreaReviewReminders(areas: Array<{ id: string; name: string; lastReviewedAt?: number }>, cadenceDays = 30): AreaReviewReminder[] {
  const now = Date.now();
  return areas.map((a) => ({
    areaId: a.id,
    areaName: a.name,
    lastReviewedAt: a.lastReviewedAt || 0,
    recommendedNextReviewAt: (a.lastReviewedAt ?? now) + cadenceDays * 24 * 60 * 60 * 1000,
  }));
}


