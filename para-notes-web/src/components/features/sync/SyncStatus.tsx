"use client";

import { useEffect, useState } from 'react';
import { useSyncStore } from '@/stores/syncStore';

export function SyncStatus() {
	const { isSyncing, lastSyncAt, pendingChanges, error } = useSyncStore();
	const [online, setOnline] = useState<boolean>(true); // Start with true for consistent SSR
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// Set the actual online status after hydration
		setOnline(navigator.onLine);
		setIsHydrated(true);
		
		const onOnline = () => setOnline(true);
		const onOffline = () => setOnline(false);
		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);
		return () => {
			window.removeEventListener('online', onOnline);
			window.removeEventListener('offline', onOffline);
		};
	}, []);

	return (
		<div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
			<span>{online ? 'Online' : 'Offline'}</span>
			<span>•</span>
			<span>{isSyncing ? 'Syncing…' : 'Idle'}</span>
			<span>•</span>
			<span>Queue: {pendingChanges.length}</span>
			{lastSyncAt && <span>• Last: {lastSyncAt.toLocaleTimeString()}</span>}
			{error && <span style={{ color: 'red' }}>• {error}</span>}
		</div>
	);
}


