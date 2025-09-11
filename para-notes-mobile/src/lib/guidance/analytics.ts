import type { GuidanceAnalyticsEvent } from '@/types/guidance';

const ANALYTICS_QUEUE = 'para_guidance_analytics_queue_v1';

export function trackGuidanceEvent(event: GuidanceAnalyticsEvent): void {
	try {
		const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(ANALYTICS_QUEUE) : null;
		const arr = raw ? (JSON.parse(raw) as GuidanceAnalyticsEvent[]) : [];
		arr.push({ ...event, timestamp: event.timestamp ?? Date.now() });
		if (typeof localStorage !== 'undefined') localStorage.setItem(ANALYTICS_QUEUE, JSON.stringify(arr));
	} catch (error) {
		console.warn('Failed to track guidance event', error);
	}
}

export function flushAnalyticsQueue(send: (batched: GuidanceAnalyticsEvent[]) => Promise<void>): Promise<void> {
	try {
		const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(ANALYTICS_QUEUE) : null;
		const arr = raw ? (JSON.parse(raw) as GuidanceAnalyticsEvent[]) : [];
		if (arr.length === 0) return Promise.resolve();
		if (typeof localStorage !== 'undefined') localStorage.removeItem(ANALYTICS_QUEUE);
		return send(arr);
	} catch {
		return Promise.resolve();
	}
}


