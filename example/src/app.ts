import { createRouter, mount } from "@dotjs/framework";
import { Home } from "./pages/Home";
import { VirtualPage } from "./pages/VirtualPage";
import store from "./store";

const routes = {
  "/": Home,
  "/virtual": VirtualPage,
};

const router = createRouter(routes, Home);
const root = document.getElementById("app");

function render() {
  if (!root) return;
  const match = router.getCurrent();
  const vnode = match.component ? match.component(match.params || {}) : null;
  root.innerHTML = "";
  if (vnode) mount(vnode, root);
}

router.subscribe(render);
store.subscribe(render);
window.addEventListener("hashchange", render);

render();
