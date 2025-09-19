# How To Use Components

Components in Dot-JS are reusable functions that return virtual DOM nodes.  
They help you organize your UI into logical, maintainable pieces.

---

## What is a component?

A component is a function that receives props (data) and returns a virtual DOM tree.

---

## Example: Simple Task Item

```ts
export function TaskItem({ todo }) {
  return h("li", null, [
    h("span", null, todo.text),
    h("button", { onClick: () => deleteTodo(todo.id) }, "Delete"),
  ]);
}
```

---

## How to use a component in a parent

Import your component and use it inside another component:

```ts
import { TaskItem } from "./TaskItem";

function TodoList({ todos }) {
  return h("ul", null, todos.map(todo => TaskItem({ todo })));
}
```

---

## Tips

- Keep components small and focused.
- Pass only the data and handlers each component needs.
- Reuse components wherever possible to avoid code duplication.