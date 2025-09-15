# Dot-js Framework

A lightweight, React-like front-end framework that lets you describe user interfaces with JavaScript. It includes state management, routing, a virtual DOM renderer, delegated event handling, DOM utilities, and a tiny HTTP client.

- **Architecture**: virtual DOM + pure functions for components, global store, router observer, delegated events for performance.
- **No external UI frameworks**: implemented from scratch.

## Installation

- Using Vite (dev in this repo):

```bash
npm install
npm run dev
```

- As a local workspace alias (see `vite.config.ts`):
```ts
resolve: { alias: { "@dotjs/framework": path.resolve(__dirname, "framework/src") } }
```

## Getting Started

```ts
import { h, mount } from "@dotjs/framework";

function Hello({ name }: { name: string }) {
  return h("h1", null, `Hello, ${name}!`);
}

const app = h("div", { className: "container" }, [
  Hello({ name: "World" })
]);

mount(app, document.getElementById("app"));
```

## Architecture and Design Principles

- **Components are functions**: `(props) => VNode`.
- **VNode builder**: `h(type, props, ...children)` returns a lightweight description of DOM.
- **Virtual DOM creation**: `createElement(vnode)` materializes nodes.
- **Mounting**: `mount(vnode, container)` renders to the DOM root.
- **State**: `createStore(initial)` returns `{ getState, setState, subscribe }` for global app state. Pure updates produce re-renders.
- **Routing**: `createRouter(routes, fallback, { mode })` matches `#/path` or History API, exposes `{ getCurrent, navigate, subscribe }`.
- **Events**: Delegated event handling. Component event props like `onClick` are stored on elements under `__listeners` and dispatched via a single document listener per event type when enabled.
- **HTTP**: `http.get/post/put/del/safe` tiny wrapper over `fetch` with JSON/text parsing and friendly errors.
- **Performance**: Encourages delegated events, immutable state updates, and lean updates via diffed VDOM.

## API Reference with Examples

### VDOM
- `h(type, props?, ...children)`
- `mount(vnode, container)`

```ts
import { h, mount } from "@dotjs/framework";

const view = h("div", { className: "box", style: { padding: "8px" } }, [
  h("button", { onClick: () => console.log("clicked") }, "Click me")
]);

mount(view, document.getElementById("app"));
```

Props support:
- `className`, `style` (object), boolean attributes, standard DOM attributes, and event props starting with `on` (e.g., `onClick`, `onInput`, `onSubmit`).

### State

```ts
import { createStore } from "@dotjs/framework";

type State = { count: number };
const store = createStore<State>({ count: 0 });

store.subscribe(() => render());

function inc() { store.setState(s => ({ count: s.count + 1 })); }
function dec() { store.setState(s => ({ count: s.count - 1 })); }

function App() {
  const { count } = store.getState();
  return h("div", null, [
    h("button", { onClick: dec }, "-"),
    h("span", null, String(count)),
    h("button", { onClick: inc }, "+"),
  ]);
}
```

- Immutable updates are recommended.
- Subscribe to trigger re-renders.
- You can persist and hydrate state externally (e.g., `localStorage`).

### Routing

```ts
import { createRouter, mount, h } from "@dotjs/framework";

const routes = {
  "/": () => h("div", null, "Home"),
  "/about": () => h("div", null, "About"),
  "/todos/:id": ({ id }: any) => h("div", null, `Todo ${id}`),
};

const router = createRouter(routes, () => h("div", null, "Not found"));
router.subscribe(render);

function render() {
  const match = router.getCurrent();
  const vnode = match.component ? match.component(match.params) : null;
  mount(vnode!, document.getElementById("app")!);
}
```

- Supports `hash` (default) and `history` modes.
- `navigate(path)` changes the URL programmatically.

### Events (Delegated)

- Attach handlers in props: `onClick`, `onInput`, `onSubmit`, etc.
- Handlers may return `false` to `preventDefault()` and `stopPropagation()` when using delegated events.
- To enable a delegated event globally, call from app setup:

```ts
import { addDelegatedEvent } from "@dotjs/framework";
addDelegatedEvent("click");
addDelegatedEvent("input");
addDelegatedEvent("submit");
```

The VDOM stores handlers on elements under `__listeners[eventName]`. The delegated dispatcher walks up the DOM to find and invoke them.

### HTTP

```ts
import { http } from "@dotjs/framework";

const res = await http.get<{ items: string[] }>("/api/items");
```

- `http.safe(url, options)` returns `{ ok: true, body } | { ok: false, error }`.

### Best Practices
- Keep components pure; derive UI from props + global state.
- Use immutable updates in the store; subscribe once at the app root to re-render.
- Prefer delegated events for high event volumes.
- Co-locate small helpers with components; keep side effects at boundaries (store, router, HTTP).
- For very large lists, consider list virtualization (render only visible items).

### Performance Notes
- Delegated events reduce listener churn and memory.
- Avoid deep tree re-renders by splitting components and only updating state that changes.
- Minimize DOM mutations by relying on VDOM diffing and prop updates.