# Getting Started with Dot-JS

This guide will help you set up your first Dot-JS project from scratch.

---

## 1. Clone the repository

```sh
git clone https://github.com/your-repo/dot-js.git
cd dot-js
```

## 2. Install dependencies

```sh
npm install
```

## 3. Run the development server

```sh
npm run dev
```

## 4. Open your app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Project structure

```
dot-js/
├── framework/
│   └── src/
├── example/
│   └── src/
├── docs/
│   └── getting-started.md
├── package.json
├── vite.config.ts
├── README.md
```

- `framework/` — the framework source code
- `example/` — your demo app
- `docs/` — documentation and how-to guides

---

## 6. Create your first component

Open `example/src/app.ts` and add:

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

---

## 7. Add a new page

Create `example/src/pages/About.ts`:

```ts
export function About() {
  return h("div", null, "This is the About page.");
}
```

Register the route in your router (usually in `app.ts`):

```ts
import { createRouter } from "@dotjs/framework";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

const routes = {
  "/": Home,
  "/about": About,
};

const router = createRouter(routes);
```

---

## 8. Add a new component

Create `example/src/components/Greeting.ts`:

```ts
export function Greeting({ name }: { name: string }) {
  return h("h2", null, `Hello, ${name}!`);
}
```

Use it in a page:

```ts
import { Greeting } from "../components/Greeting";

export function Home() {
  return h("div", null, [
    Greeting({ name: "Dot-JS User" })
  ]);
}
```

---

## 9. Next steps

- Explore [How To Use Components](./how-to-components.md)
- Explore [How To Use Routing](./how-to-route.md)
- Explore [How To Use CRUD with HTTP](./how-to-crud.md)
- Explore [Parent-Child Components](./how-to-component-sharing.md)

---

## 10. Need help?

See [framework/README.md](../framework/README.md) for API reference, troubleshooting, and best practices.