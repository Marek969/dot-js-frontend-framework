# How To Use Routing

Dot-JS supports hash-based routing for single-page navigation.

## Example

```ts
import { createRouter } from "@dotjs/framework";

const routes = {
  "/": HomePage,
  "/todo": TodoPage,
  "/notes": NotesPage,
};

const router = createRouter(routes);

router.subscribe(render);

function render() {
  const match = router.getCurrent();
  mount(match.component(), document.getElementById("app"));
}
```

## Programmatic navigation

```ts
router.navigate("/todo");
```