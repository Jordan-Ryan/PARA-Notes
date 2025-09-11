import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { PARA_CATEGORIES, PARA_CATEGORY_LABELS } from '@/constants/para';

type Props = {
	visible: boolean;
	onClose: () => void;
	onMove: (category: 'projects' | 'areas' | 'resources' | 'archive') => void;
};

export const MoveNoteModal: React.FC<Props> = ({ visible, onClose, onMove }) => {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ width: '90%', maxWidth: 420, backgroundColor: 'white', borderRadius: 8, padding: 16 }}>
					<Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Move Note</Text>
					{PARA_CATEGORIES.map((cat) => (
						<TouchableOpacity key={cat} onPress={() => onMove(cat)} style={{ padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, marginBottom: 8 }}>
							<Text style={{ fontWeight: '500' }}>{PARA_CATEGORY_LABELS[cat]}</Text>
						</TouchableOpacity>
					))}
					<View style={{ alignItems: 'flex-end', marginTop: 8 }}>
						<TouchableOpacity onPress={onClose}>
							<Text>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};


