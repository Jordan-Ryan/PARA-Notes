import { useEffect } from 'react';
import { useSyncStore } from '@/stores/syncStore';

export function NetworkDetector() {
	const { setOnline } = useSyncStore();
	useEffect(() => {
		const onOnline = () => setOnline(true);
		const onOffline = () => setOnline(false);
		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);
		setOnline(navigator.onLine);
		return () => {
			window.removeEventListener('online', onOnline);
			window.removeEventListener('offline', onOffline);
		};
	}, [setOnline]);
	return null;
}


