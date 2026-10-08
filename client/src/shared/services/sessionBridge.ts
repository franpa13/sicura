type SessionExpiredHandler = (message: string) => void;

const handlers = new Set<SessionExpiredHandler>();

export function onSessionExpired(handler: SessionExpiredHandler): () => void {
  handlers.add(handler);

  return () => {
    handlers.delete(handler);
  };
}

export function notifySessionExpired(message: string): void {
  handlers.forEach((handler) => handler(message));
}