import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PARA_CATEGORY_LABELS } from '@/constants/para';
import type { ClassifierResult } from '@/types/guidance';

type Props = {
	result: ClassifierResult | null;
	onAccept: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
	onDismiss?: () => void;
};

export const GuidanceBar: React.FC<Props> = ({ result, onAccept, onDismiss }) => {
	if (!result?.best) return null;
	const best = result.best;
	return (
		<View style={{ padding: 8, backgroundColor: '#F3F4F6', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
			<Text style={{ fontSize: 14 }}>
				Suggest: {PARA_CATEGORY_LABELS[best.category]} • {(best.confidence.value * 100).toFixed(0)}%
			</Text>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<TouchableOpacity onPress={() => onAccept(best.category)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#111827', borderRadius: 6 }}>
					<Text style={{ color: 'white' }}>Accept</Text>
				</TouchableOpacity>
				{onDismiss ? (
					<TouchableOpacity onPress={onDismiss} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
						<Text>Dismiss</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
};


