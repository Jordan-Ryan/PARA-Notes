import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PARA_CATEGORIES, PARA_CATEGORY_LABELS } from '@/constants/para';

type Props = {
	onSelect: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
};

export const ParaChips: React.FC<Props> = ({ onSelect }) => {
	return (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
			{PARA_CATEGORIES.map((cat) => (
				<TouchableOpacity key={cat} onPress={() => onSelect(cat)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, borderWidth: 1, borderColor: '#D1D5DB' }}>
					<Text>{PARA_CATEGORY_LABELS[cat]}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};


