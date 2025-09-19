# Parent-Child Components

Dot-JS lets you nest components and pass data or event handlers between them.  
This is useful for building complex UIs from simple, reusable pieces.

---

## Example: Passing data and handlers

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

---

## How it works

- The parent (`TodoSection`) passes both the todo item and the `onDelete` handler to each child (`TaskItem`).
- The child calls `onDelete(todo.id)` when the button is clicked.

---

## Tips

- Use parent-child composition to keep your code modular.
- Pass only the props each child needs.
- Use handler functions to let parents control actions triggered by children.