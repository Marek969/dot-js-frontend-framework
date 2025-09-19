# How To Use CRUD with HTTP

Dot-JS provides a simple HTTP client for REST API calls.

## Example: Fetch todos

```ts
import { http } from "@dotjs/framework";

async function fetchTodos() {
  const res = await http.get("/api/todos");
  if (res.ok) {
    store.setState(s => ({ ...s, todos: res.body }));
  }
}
```

## Example: Add todo

```ts
async function addTodo(text) {
  const res = await http.post("/api/todos", { text });
  if (res.ok) fetchTodos();
}
```

## Example: Delete todo

```ts
async function deleteTodo(id) {
  const res = await http.delete(`/api/todos/${id}`);
  if (res.ok) fetchTodos();
}
```