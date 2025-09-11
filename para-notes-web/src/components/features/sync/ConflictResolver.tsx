import { useSyncStore } from '@/stores/syncStore';

export function ConflictResolver() {
	const { conflicts, resolveConflict } = useSyncStore();
	if (conflicts.length === 0) return null;
	return (
		<div style={{ border: '1px solid #f59e0b', padding: 8, borderRadius: 6 }}>
			<strong>Conflicts</strong>
			<ul>
				{conflicts.map((c) => (
					<li key={c.id}>
						{c.entityType} {c.entityId}
						<div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
							<button onClick={() => resolveConflict(c.id, 'local')}>Keep local</button>
							<button onClick={() => resolveConflict(c.id, 'remote')}>Keep remote</button>
							<button onClick={() => resolveConflict(c.id, 'merge')}>Merge</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}


