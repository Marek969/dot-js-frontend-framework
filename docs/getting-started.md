# Getting Started with Dot-JS

This guide will help you set up your first Dot-JS project from scratch.

---

## 1. Clone the repository

Clone the official Dot-JS repository from Gitea:

```sh
git clone https://gitea.kood.tech/robinpall/frontend-framework.git
cd frontend-framework
```

## 2. Install dependencies

Install all required packages using npm:

```sh
npm install
```

## 3. Run the development server

Start the local development server:

```sh
npm run dev
```

## 4. Open your app

Open your browser and visit [http://localhost:5173](http://localhost:5173) to see your app running.

---

## 5. Project structure

Your project will look like this:

```
frontend-framework/
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

- `framework/` — the Dot-JS framework source code
- `example/` — your demo application
- `docs/` — documentation and how-to guides

---

## 6. Create your first component

Open `example/src/app.ts` and add the following code to create a simple component:

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

This will render "Hello, World!" on the page.

---

## 7. Add a new page

To add a new page, create `example/src/pages/About.ts`:

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

Now you can navigate to `/about` in your app.

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

- Explore [How To Use Components](./how-to-components.md) for more on reusable UI.
- Explore [How To Use Routing](./how-to-route.md) for navigation between pages.
- Explore [How To Use CRUD with HTTP](./how-to-crud.md) for data fetching and manipulation.
- Explore [Parent-Child Components](./how-to-component-sharing.md) for component composition.

---

## 10. Need help?

See [framework/README.md](../framework/README.md) for API reference, troubleshooting, and best practices.