import React from 'react';
import { View, Text } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSyncStore } from '@/stores/syncStore';

export function SyncStatus() {
  const { isSyncing, lastSyncAt, pendingChanges, error } = useSyncStore();
  const net = useNetInfo();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text>{net.isConnected ? 'Online' : 'Offline'}</Text>
      <Text>•</Text>
      <Text>{isSyncing ? 'Syncing…' : 'Idle'}</Text>
      <Text>•</Text>
      <Text>Queue: {pendingChanges.length}</Text>
      {lastSyncAt && <Text>• Last: {new Date(lastSyncAt).toLocaleTimeString()}</Text>}
      {error && <Text style={{ color: 'red' }}>• {error}</Text>}
    </View>
  );
}


