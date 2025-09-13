import { VNode, createElement } from "./vdom";

let oldVNode: VNode | null = null;
let rootEl: Element | null = null;

export function mount(vNode: VNode | null, container: Element | null) {
  if (!container) {
    console.warn("mount(): container is null");
    return;
  }

  if (!rootEl) {
    rootEl = container;
  }

  rootEl.innerHTML = "";

  if (vNode) {
    const el = createElement(vNode);
    rootEl.appendChild(el);
  }

  oldVNode = vNode;
}
