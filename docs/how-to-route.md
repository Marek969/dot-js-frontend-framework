# How To Use Routing

Dot-JS supports hash-based routing for single-page navigation.  
Routing lets you display different pages or components based on the URL.

---

## Step 1: Define your routes

Create a routes object mapping paths to components:

```ts
const routes = {
  "/": HomePage,
  "/todo": TodoPage,
  "/notes": NotesPage,
};
```

---

## Step 2: Create the router

Import and initialize the router:

```ts
import { createRouter } from "@dotjs/framework";

const router = createRouter(routes);
```

---

## Step 3: Render the current route

Subscribe to router changes and render the matched component:

```ts
router.subscribe(render);

function render() {
  const match = router.getCurrent();
  mount(match.component(), document.getElementById("app"));
}
```

---

## Step 4: Programmatic navigation

You can change the route from code:

```ts
router.navigate("/todo");
```

---

## Tips

- Use clear, unique paths for each page.
- Keep your routes object up to date as you add new pages.
- Use router navigation for links and buttons to avoid full page reloads.