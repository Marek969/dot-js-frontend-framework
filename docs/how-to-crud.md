# How To Use CRUD with HTTP

Dot-JS provides a simple HTTP client for REST API calls.  
CRUD stands for Create, Read, Update, Delete — the basic operations for working with data.

---

## Example: Fetch todos (Read)

```ts
import { http } from "@dotjs/framework";

async function fetchTodos() {
  const res = await http.get("/api/todos");
  if (res.ok) {
    store.setState(s => ({ ...s, todos: res.body }));
  }
}
```

---

## Example: Add todo (Create)

```ts
async function addTodo(text) {
  const res = await http.post("/api/todos", { text });
  if (res.ok) fetchTodos();
}
```

---

## Example: Delete todo (Delete)

```ts
async function deleteTodo(id) {
  const res = await http.delete(`/api/todos/${id}`);
  if (res.ok) fetchTodos();
}
```

---

## Tips

- Always check `res.ok` before using the response data.
- After creating or deleting, refresh your data by calling `fetchTodos()`.
- Handle errors gracefully (show messages or retry).