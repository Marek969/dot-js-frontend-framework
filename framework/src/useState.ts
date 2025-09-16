/**
 * useState hook for global state management.
 * Stores state in a global map, allows subscriptions, and triggers updates on state change.
 * Useful for sharing state and reacting to changes across components.
 *
 * @param initialValue - The initial state value.
 * @returns [state, setState, subscribe] tuple.
 */

type Listener<T> = (state: T) => void;

const stateStore = new Map<string, any>();
const listeners = new Map<string, Listener<any>[]>();

function generateKey(): string {
    return Math.random().toString(36).slice(2, 11);
}

export function useState<T>(initialValue: T): [T, (newValue: T) => void, (listener: Listener<T>) => void] {
    const key = generateKey();
    stateStore.set(key, initialValue);
    listeners.set(key, []);

    const setState = (newValue: T) => {
        stateStore.set(key, newValue);
        listeners.get(key)?.forEach(listener => listener(newValue));
    };

    const subscribe = (listener: Listener<T>) => {
        listeners.get(key)?.push(listener);
    };

    return [stateStore.get(key), setState, subscribe];
}