type QueueItem = {
  id: string;
  noteId: string;
  html: string;
  createdAt: number;
};

const KEY = 'offline-queue';

function readQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueueItem[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(items: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function enqueue(item: QueueItem) {
  const q = readQueue();
  q.push(item);
  writeQueue(q);
}

export function drain(handler: (item: QueueItem) => Promise<void>) {
  const q = readQueue();
  return (async () => {
    const remain: QueueItem[] = [];
    for (const it of q) {
      try {
        await handler(it);
      } catch (e) {
        remain.push(it);
      }
    }
    writeQueue(remain);
  })();
}


