import { useState } from 'react';
import { useSyncStore } from '@/stores/syncStore';

export function OfflineQueue() {
	const { pendingChanges } = useSyncStore();
	const [expanded, setExpanded] = useState(false);

	if (pendingChanges.length === 0) return null;

	return (
		<div style={{ border: '1px solid #ccc', padding: 8, borderRadius: 6 }}>
			<button onClick={() => setExpanded((v) => !v)}>
				Pending operations ({pendingChanges.length})
			</button>
			{expanded && (
				<ul style={{ marginTop: 8 }}>
					{pendingChanges.map((c) => (
						<li key={c.id}>
                                                        {c.type} {c.entityType} {c.entityId} retries:{c.retryCount}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}


