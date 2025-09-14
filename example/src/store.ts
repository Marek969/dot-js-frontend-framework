import { createStore } from "@dotjs/framework";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
export interface AppState {
  todos: Todo[];
  scrollOffset: number;
  newTodo: string;
}

// Load from localStorage
function loadState(): AppState {
  try {
    const raw = localStorage.getItem("todos");
    const todos = raw ? JSON.parse(raw) : [];
    return { todos, scrollOffset: 0, newTodo: "" };
  } catch {
    return { todos: [], scrollOffset: 0, newTodo: "" };
  }
}

const store = createStore<AppState>(loadState());

// Save to localStorage on change
store.subscribe((state) => {
  localStorage.setItem("todos", JSON.stringify(state.todos));
});

export function useStore() {
  return store.getState();
}
export function addTodo() {
  const { newTodo, todos, scrollOffset } = store.getState();
  if (!newTodo || !newTodo.trim()) return;
  store.setState((s) => ({
    ...s,
    todos: s.todos.concat({ id: Date.now(), text: newTodo.trim(), completed: false }),
    newTodo: "",
  }));
}
export function toggleTodo(id: number) {
  store.setState((s) => ({
    ...s,
    todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  }));
}
export function deleteTodo(id: number) {
  store.setState((s) => ({
    ...s,
    todos: s.todos.filter((t) => t.id !== id),
  }));
}
export async function loadSampleData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  const data = await res.json();
  store.setState((s) => ({
    ...s,
    todos: s.todos.concat(
      data.map((t: any) => ({
        id: t.id + Date.now(),
        text: t.title,
        completed: t.completed,
      }))
    ),
  }));
}

export default store;