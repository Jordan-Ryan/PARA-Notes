import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSyncStore } from '@/stores/syncStore';

export function ConflictResolver() {
  const { conflicts, resolveConflict } = useSyncStore();
  if (conflicts.length === 0) return null;
  return (
    <View style={{ borderWidth: 1, borderColor: '#f59e0b', padding: 8, borderRadius: 6 }}>
      <Text style={{ fontWeight: '600' }}>Conflicts</Text>
      {conflicts.map((c) => (
        <View key={c.id} style={{ marginTop: 8 }}>
          <Text>{c.entityType} {c.entityId}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Pressable onPress={() => resolveConflict(c.id, 'local')}><Text>Keep local</Text></Pressable>
            <Pressable onPress={() => resolveConflict(c.id, 'remote')}><Text>Keep remote</Text></Pressable>
            <Pressable onPress={() => resolveConflict(c.id, 'merge')}><Text>Merge</Text></Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}


