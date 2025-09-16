import { mount, createRouter } from "@dotjs/framework";
import { addDelegatedEvent } from "@dotjs/framework";
import { Home } from "./pages/Home";
import { Todo } from "./pages/Todo";
import { Notes } from "./pages/Notes";
import store from "./store";

// Enable delegated events used by the app
addDelegatedEvent("click");
addDelegatedEvent("input");
addDelegatedEvent("submit");
addDelegatedEvent("scroll");

const routes = {
  "/": Home,
  "/todo": (p?: any) => Todo({ filter: undefined }),
  "/todo/:filter": (p: any) => Todo({ filter: p.filter }),
  "/notes": Notes,
};

const router = createRouter(routes, Home);

const root = document.getElementById("app");
let lastPattern: string | undefined;
function setActiveNav(path: string) {
  const links = Array.from(document.querySelectorAll('.navbar .nav-link')) as HTMLAnchorElement[];
  links.forEach(a => a.classList.remove('active'));
  const match = links.find(a => a.getAttribute('href') === `#${path}` || (path === '/' && a.getAttribute('href') === '#/'));
  if (match) match.classList.add('active');
}
function render() {
  if (!root) return;
  const match = router.getCurrent();
  const vnode = match.component ? match.component(match.params || {}) : null;
  setActiveNav(match.pattern || '/');
  if (match.pattern !== lastPattern) {
    mount(null as any, root);
    lastPattern = match.pattern;
  }
  if (vnode) mount(vnode, root);
}
router.subscribe(render);
store.subscribe(render);
render();
