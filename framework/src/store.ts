import { shallowEqual } from './utils';

export type Subscriber<T> = (state: T) => void;
export type Unsubscribe = () => void;

export interface StoreAPI<T> {
  getState(): T;
  setState(updater: Partial<T> | ((state: T) => Partial<T> | T)): void;
  subscribe(listener: Subscriber<T>): Unsubscribe;
}
export function createStore<T extends Record<string, any> = Record<string, any>>(
  initialState: T = {} as T,
  options?: {
    comparator?: (a: T, b: T) => boolean;
    plugins?: Array<((state: T, api: StoreAPI<T>) => void) | { onInit?: (api: StoreAPI<T>) => void; onChange?: (state: T, api: StoreAPI<T>) => void }>;
  }
): StoreAPI<T> {
  let state: T = { ...initialState };
  const listeners: Subscriber<T>[] = [];
  const comparator = options?.comparator ?? shallowEqual;
  const plugins = options?.plugins ?? [];

  function getState(): T {
    return state;
  }

  function setState(updater: Partial<T> | ((state: T) => Partial<T> | T)): void {
    const newState = typeof updater === 'function'
      ? (updater({ ...state }) as T | Partial<T>)
      : { ...state, ...(updater || {}) };

    if (comparator(state, newState as T)) return;
    state = (newState as T);

    listeners.slice().forEach(l => {
      try { l(state); } catch (err) {console.error('store listener error', err); }
    });

    plugins.forEach(p => {
      try {
        if (typeof p === 'function') p(state, api);
        else if (p && typeof p.onChange === 'function') p.onChange(state, api);
      } catch (err) {console.error('store plugin error', err); }
    });
  }

  function subscribe(listener: Subscriber<T>): Unsubscribe {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  const api: StoreAPI<T> = { getState, setState, subscribe };

  plugins.forEach(p => {
    try {
      if (p && typeof (p as any).onInit === 'function') (p as any).onInit(api);
      else if (typeof p === 'function') (p as any)(api.getState(), api);
    } catch (err) {console.error('store plugin init error', err); }
  });

  return api;
}
