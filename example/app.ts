import {
  createStore,
  createRouter,
  mount,
  http,
  h,
  VNode,
} from "../framework/src/index";
import { updateElement } from "../framework/src/vdom";

export type Component<P = any> = (props: P) => VNode;
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface AppState {
  todos: Todo[];
  scrollOffset: number;
  newTodo: string;
}

const store = createStore<AppState>({
  todos: [],
  scrollOffset: 0,
  newTodo: "",
});

try {
  const persisted = JSON.parse(localStorage.getItem("todos") || "[]");
  if (Array.isArray(persisted) && persisted.length) {
    store.setState({ todos: persisted as Todo[] });
  }
} catch (_) {}

store.subscribe((state) => {
  try {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  } catch (_) {}
});
function addTodo() {
  const { newTodo } = store.getState();
  if (!newTodo || !newTodo.trim()) return;
  store.setState((s) => ({
    todos: s.todos.concat({ id: Date.now(), text: newTodo.trim(), completed: false }),
    newTodo: "",
  }));
}

function toggleTodo(id: number) {
  store.setState((s) => ({
    todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
  }));
}

function deleteTodo(id: number) {
  store.setState((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
}

async function loadSampleData() {
  try {
    const data = await http.get<any[]>("https://jsonplaceholder.typicode.com/todos?_limit=5");
    const newTodos: Todo[] = data.map((item) => ({
      id: Date.now() + item.id,
      text: item.title,
      completed: !!item.completed,
    }));
    store.setState((s) => ({ todos: s.todos.concat(newTodos) }));
  } catch (err) {
    console.error("Failed to load sample data", err);
  }
}
function Stats(): VNode {
  const { todos } = store.getState();
  const completedCount = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const remaining = total - completedCount;
  return h("div", { className: "stats mb-4" }, `${remaining} remaining / ${total} total`);
}
function TaskItem({ todo }: { todo: Todo }): VNode {
  return h(
    "li",
    {
      key: todo.id,
      className: "todo-item flex justify-between items-center py-1",
      style: {
        textDecoration: todo.completed ? "line-through" : "none",
        color: todo.completed ? "gray" : "black",
      },
    },
    [
      h("span", { onClick: () => toggleTodo(todo.id), style: { cursor: "pointer" } }, todo.text),
      h("button", { onClick: () => deleteTodo(todo.id), className: "button-delete ml-2" }, "×"),
    ]
  );
}
function TodoSection({ title, todos }: { title: string; todos: Todo[] }): VNode {
  return h("section", { className: "todo-section mb-4" }, [
    h("h3", { className: "text-lg font-semibold mb-2" }, title),
    h("ul", null, todos.map((todo) => h(TaskItem, { todo }))),
  ]);
}
function parseQuery(): { path: string; query: Record<string, string> } {
  const hash = window.location.hash.slice(1) || "/";
  const [path, queryString] = hash.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  return { path, query };
}
function Home(): VNode {
  const { todos, newTodo } = store.getState();
  const { query } = parseQuery();
  const filter = query.filter || "all";
  const filteredTodos =
    filter === "completed" ? todos.filter((t) => t.completed) : filter === "active" ? todos.filter((t) => !t.completed) : todos;

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    store.setState({ newTodo: value });
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    addTodo();
    return false;
  }

  function completeAll() {
    store.setState((s) => ({ todos: s.todos.map((t) => ({ ...t, completed: true })) }));
  }

  return h("div", { className: "p-6" }, [
    h("h2", { className: "text-xl font-semibold mb-4" }, "Todo List"),
    h(Stats),
    h("form", { onSubmit: handleSubmit, className: "mb-4 flex gap-2" }, [
      h("input", {
        type: "text",
        placeholder: "Add a task...",
        value: newTodo,
        onInput: handleInput,
        className: "todo-input flex-1",
      }),
      h("button", { type: "submit", className: "button-primary" }, "Add"),
      h("button", { type: "button", onClick: loadSampleData, className: "button-secondary" }, "Load Sample"),
    ]),
    h("button", { type: "button", onClick: completeAll, className: "button-secondary mb-4" }, "Complete All Tasks"),
    h(TodoSection, { title: "Tasks", todos: filteredTodos }),
    h("div", null, [
      h("a", { href: "#/?filter=all" }, "All"),
      h("span", null, " | "),
      h("a", { href: "#/?filter=active" }, "Active"),
      h("span", null, " | "),
      h("a", { href: "#/?filter=completed" }, "Completed"),
      h("span", null, " | "),
      h("a", { href: "#/virtual" }, "Virtual List"),
    ]),
  ]);
}

const largeList: string[] = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

function VirtualList() {
  const { scrollOffset } = store.getState();
  const itemHeight = 30;
  const containerHeight = 400;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const buffer = 10;
  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - buffer);
  const endIndex = Math.min(largeList.length, startIndex + visibleCount + (buffer * 2));
  const offsetY = startIndex * itemHeight;
  function onScroll(e: Event) {
    const target = e.target as HTMLElement;
    store.setState({ scrollOffset: target.scrollTop });
  }
  const visibleItems = largeList.slice(startIndex, endIndex);
  return h(
    "div",
    {
      style: {
        height: containerHeight + "px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "4px",
        position: "relative",
      },
      onScroll,
      className: "virtual-list",
    },
    [
      h(
        "div",
        {
          style: {
            height: largeList.length * itemHeight + "px",
            position: "relative",
          },
        },
        h(
          "div",
          {
            style: {
              transform: `translateY(${offsetY}px)`,
              position: "absolute",
              top: "0px",
              left: "0px",
              right: "0px",
            },
          },
          visibleItems.map((item, i) =>
            h(
              "div",
              {
                key: startIndex + i,
                style: {
                  height: itemHeight + "px",
                  borderBottom: "1px solid #f3f4f6",
                  padding: "4px 8px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: (startIndex + i) % 2 === 0 ? "#ffffff" : "#f9fafb",
                },
              },
              `${item} (Index: ${startIndex + i})`
            )
          )
        )
      ),
      h(
        "div",
        {
          style: {
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
          },
        },
        `Showing ${visibleItems.length} of ${largeList.length} items`
      )
    ]
  );
}

function VirtualPage(): VNode {
  return h("div", { className: "p-6 flex flex-col items-center" }, [
    h("h2", { className: "text-xl font-semibold mb-4 text-blue-700" }, "Virtualized List (10,000 items)"),
    h("p", { className: "mb-4 text-gray-600" }, "Scroll to see virtualization in action. Only visible items are rendered."),
    h(VirtualList),
    h("div", { className: "mt-4" }, h("a", { href: "#/" }, "← Back to Todo List"))
  ]);
}

const routes: Record<string, Component<any>> = {
  "/": Home,
  "/completed": () => h("div", { className: "p-6" }, "Completed (stub)"),
  "/active": () => h("div", { className: "p-6" }, "Active (stub)"),
  "/virtual": VirtualPage,
};
const router = createRouter(routes, Home);
const root = document.getElementById("app");
let currentVNode: VNode | null = null;
function render() {
  if (!root) return;
  const match = router.getCurrent();
  const newVNode = match.component ? match.component(match.params || {}) : null;
  const isVirtualRoute = match.pattern === "/virtual" || match.pattern === "/virtual/";
  if (isVirtualRoute) {
    updateElement(root, newVNode as any, currentVNode as any, 0);

    const virtualEl = root.querySelector(".virtual-list") as HTMLElement | null;
    if (virtualEl) {
      const desired = store.getState().scrollOffset || 0;
      if (Math.abs(virtualEl.scrollTop - desired) > 1) virtualEl.scrollTop = desired;
    }
  } else {
    root.innerHTML = "";
    if (newVNode) mount(newVNode, root);
  }

  currentVNode = newVNode;
}
router.subscribe(render);
store.subscribe(render);
window.addEventListener("hashchange", render);
render();
