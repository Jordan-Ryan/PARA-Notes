import * as Y from 'yjs';

export type CollabBootstrap = {
  doc: Y.Doc;
  awareness?: any;
};

// Minimal Y.Doc bootstrap for future providers (e.g., y-webrtc, y-websocket)
export function createCollabDoc(): CollabBootstrap {
  const doc = new Y.Doc();
  return { doc };
}


