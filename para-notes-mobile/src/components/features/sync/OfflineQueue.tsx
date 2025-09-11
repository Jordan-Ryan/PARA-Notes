import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSyncStore } from '@/stores/syncStore';

export function OfflineQueue() {
  const { pendingChanges } = useSyncStore();
  const [expanded, setExpanded] = useState(false);
  if (pendingChanges.length === 0) return null;
  return (
    <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 }}>
      <Pressable onPress={() => setExpanded(v => !v)}>
        <Text>Pending operations ({pendingChanges.length})</Text>
      </Pressable>
      {expanded && (
        <View style={{ marginTop: 8 }}>
          {pendingChanges.map((c) => (
            <Text key={c.id}>
              {(c as any).operationType ?? c.type} {c.entityType} {c.entityId} retries:{c.retryCount}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}


