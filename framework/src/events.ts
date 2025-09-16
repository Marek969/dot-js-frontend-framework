export type DelegatedEntry = { handler: (e: Event) => void; count: number };

export const NON_BUBBLING = new Set([
  'focus', 'blur', 'mouseenter', 'mouseleave', 'scroll'
]);

const delegated: Map<string, DelegatedEntry> = new Map();
declare global {
  interface Element {
    __listeners?: Record<string, EventListener | undefined>;
    __directListeners?: Record<string, EventListener | undefined>;
  }
}

export function addDelegatedEvent(eventName: string): void {
  if (NON_BUBBLING.has(eventName)) return;
  if (delegated.has(eventName)) {
    delegated.get(eventName)!.count++;
    return;
  }

  const handler = function (e: Event) {
    let node = e.target as Element | null;
    while (node) {
      const fn = node.__listeners?.[eventName];
      if (typeof fn === 'function') {
        try {
          const ret = fn.call(node, e);
          if (ret === false) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
        } catch (err) {
          console.error('Delegated handler error', err);
        }
      }
      node = node.parentElement;
    }
  };

  document.addEventListener(eventName, handler);
  delegated.set(eventName, { handler, count: 1 });
}

export function removeDelegatedEvent(eventName: string): void {
  const entry = delegated.get(eventName);
  if (!entry) return;
  entry.count--;
  if (entry.count <= 0) {
    document.removeEventListener(eventName, entry.handler);
    delegated.delete(eventName);
  }
}
