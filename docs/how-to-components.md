# How To Use Components

Components are reusable functions that return virtual DOM nodes.

## Example

```ts
export function TaskItem({ todo }) {
  return h("li", null, [
    h("span", null, todo.text),
    h("button", { onClick: () => deleteTodo(todo.id) }, "Delete"),
  ]);
}
```

## Usage

Import your component and use it in a parent:

```ts
import { TaskItem } from "./TaskItem";

function TodoList({ todos }) {
  return h("ul", null, todos.map(todo => TaskItem({ todo })));
}
```