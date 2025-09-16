import { createStore } from "@dotjs/framework";

export interface Note {
  id: number;
  text: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface AppState {
  todos: Todo[];
  notes: Note[];
  editingId?: number | null;
  draftValue?: string;
}

// Load state from localStorage
function loadState(): AppState {
  try {
    const raw = localStorage.getItem("appState");
    const parsed = raw ? JSON.parse(raw) : { todos: [], notes: [] };
    return {
      todos: parsed.todos || [],
      notes: parsed.notes || [],
      editingId: null,
      draftValue: "",
    };
  } catch {
    return {
      todos: [],
      notes: [],
      editingId: null,
      draftValue: "",
    };
  }
}

const store = createStore<AppState>(loadState());

// Persist only durable state
store.subscribe((state) => {
  const persist = { todos: state.todos, notes: state.notes };
  localStorage.setItem("appState", JSON.stringify(persist));
});

export function useStore() {
  return store.getState();
}

// ---------- Notes ----------
export function addNote(text: string) {
  if (!text || !text.trim()) return;
  store.setState((s) => ({
    ...s,
    notes: s.notes.concat({ id: Date.now(), text: text.trim() }),
  }));
}

export function deleteNote(id: number) {
  store.setState((s) => ({
    ...s,
    notes: s.notes.filter((n) => n.id !== id),
  }));
}

export function updateNote(id: number, text: string) {
  store.setState((s) => ({
    ...s,
    notes: s.notes.map((n) => (n.id === id ? { ...n, text } : n)),
  }));
}

// ---------- Todos ----------
export function addTodo(text: string) {
  if (!text || !text.trim()) return;
  store.setState((s) => ({
    ...s,
    todos: s.todos.concat({ id: Date.now(), text: text.trim(), completed: false }),
  }));
}

export function deleteTodo(id: number) {
  store.setState((s) => ({
    ...s,
    todos: s.todos.filter((t) => t.id !== id),
  }));
}

export function toggleTodo(id: number) {
  store.setState((s) => ({
    ...s,
    todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  }));
}

export function updateTodo(id: number, text: string) {
  store.setState((s) => ({
    ...s,
    todos: s.todos.map((t) => (t.id === id ? { ...t, text } : t)),
  }));
}

export default store;
