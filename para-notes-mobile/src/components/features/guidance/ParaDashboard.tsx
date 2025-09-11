import React from 'react';
import { View, Text } from 'react-native';
import { computeAreaReviewReminders } from '@/lib/guidance/reminders';

type Props = {
	counts: { projects: number; areas: number; resources: number; archive: number };
	areas: Array<{ id: string; name: string; lastReviewedAt?: number }>;
};

export const ParaDashboard: React.FC<Props> = ({ counts, areas }) => {
	const reminders = computeAreaReviewReminders(areas);
	return (
		<View style={{ gap: 12 }}>
			<View style={{ padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 }}>
				<Text style={{ fontWeight: '600', marginBottom: 6 }}>Category Health</Text>
				<Text>Projects: {counts.projects}</Text>
				<Text>Areas: {counts.areas}</Text>
				<Text>Resources: {counts.resources}</Text>
				<Text>Archive: {counts.archive}</Text>
			</View>
			<View style={{ padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 }}>
				<Text style={{ fontWeight: '600', marginBottom: 6 }}>Area Review Reminders</Text>
				{reminders.map((r) => (
					<Text key={r.areaId}>
						{r.areaName}: {new Date(r.recommendedNextReviewAt).toLocaleDateString()}
					</Text>
				))}
			</View>
		</View>
	);
};


