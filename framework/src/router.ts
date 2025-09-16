import type { Component } from './vdom';

/**
 * Features:
 * - Supports `hash` (default) and `history` modes.
 * - Register routes with dynamic params (`:id`) and wildcards (`*`).
 * - Programmatically navigate with `navigate(path)`.
 * - Automatically reacts to browser navigation (back/forward).
 * - Subscribe to route changes for reactive UI updates.
 * - Supports a fallback (Not Found) component.
 *
 * Usage:
 * ```ts
 * const routes = {
 *   '/': HomePage,
 *   '/about': AboutPage,
 *   '/todos/:id': TodoPage
 * };
 *
 * const router = createRouter(routes, NotFound, { mode: 'hash' });
 * router.subscribe(() => {
 *   const match = router.getCurrent();
 *   mount(match.component(match.params), document.getElementById('app')!);
 * });
 * ```
 */

type RouteMatch = {
  component: Component | null;
  params: Record<string, string>;
  pattern?: string;
};

function compileRoute(pattern: string) {
  const parts = pattern.split('/').filter(Boolean);
  const keys: string[] = [];
  const regexParts = parts.map(p => {
    if (p.startsWith(':')) { 
      keys.push(p.slice(1)); 
      return '([^/]+)'; 
    }
    if (p === '*') { 
      keys.push('wild'); 
      return '(.*)'; 
    }
    return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  const regex = new RegExp('^/' + regexParts.join('/') + '/?$');
  return { pattern, regex, keys };
}

export function createRouter(
  routeMap: Record<string, Component>,
  fallback: Component | null = null,
  options?: { mode?: 'hash' | 'history' }
) {
  const mode = options?.mode || 'hash';
  const subscribers: Array<() => void> = [];
  const compiled = Object.keys(routeMap).map(k => ({
    key: k,
    ...compileRoute(k),
    component: routeMap[k],
  }));

  function notify() { subscribers.slice().forEach(fn => fn()); }

  function getCurrentRaw(): string {
    if (mode === 'history') {
      const path = window.location.pathname + window.location.search;
      return path || '/';
    }
    const hash = window.location.hash.slice(1) || '/';
    return hash.startsWith('/') ? hash : '/' + hash;
  }

  function match(path: string): RouteMatch {
    for (const c of compiled) {
      const m = path.match(c.regex);
      if (m) {
        const params: Record<string, string> = {};
        c.keys.forEach((k, i) => { params[k] = m[i + 1]; });
        return { component: c.component, params, pattern: c.pattern };
      }
    }
    return { component: fallback, params: {} };
  }

  function getCurrent(): RouteMatch {
    return match(getCurrentRaw());
  }

  function navigate(to: string) {
    if (mode === 'history') {
      if (!to.startsWith('/')) to = '/' + to;
      history.pushState({}, '', to);
      notify();
    } else {
      if (!to.startsWith('#')) to = '#' + (to.startsWith('/') ? to.slice(1) : to);
      window.location.hash = to;
    }
  }

  function onChange() { notify(); }

  if (mode === 'history') {
    window.addEventListener('popstate', onChange);
  } else {
    window.addEventListener('hashchange', onChange);
  }

  function subscribe(fn: () => void) {
    subscribers.push(fn);
    return () => {
      const i = subscribers.indexOf(fn);
      if (i > -1) subscribers.splice(i, 1);
    };
  }

  function destroy() {
    if (mode === 'history') window.removeEventListener('popstate', onChange);
    else window.removeEventListener('hashchange', onChange);
    subscribers.length = 0;
  }

  return { getCurrent, navigate, subscribe, destroy };
}
