# Parent-Child Components

You can nest components and pass data or event handlers between them.

## Example

```ts
export function TodoSection({ todos, onDelete }) {
  return h("ul", null, todos.map(todo =>
    TaskItem({ todo, onDelete })
  ));
}

export function TaskItem({ todo, onDelete }) {
  return h("li", null, [
    h("span", null, todo.text),
    h("button", { onClick: () => onDelete(todo.id) }, "Delete"),
  ]);
}
```