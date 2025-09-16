import { VNode, createElement } from "./vdom";
import { updateElement } from "./vdom";

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

  if (!vNode) {
    if (rootEl.firstChild) rootEl.removeChild(rootEl.firstChild);
    oldVNode = null;
    return;
  }

  if (!oldVNode) {
    const el = createElement(vNode);
    if (rootEl.firstChild) rootEl.replaceChild(el, rootEl.firstChild);
    else rootEl.appendChild(el);
  } else {
    updateElement(rootEl, vNode, oldVNode, 0);
  }

  oldVNode = vNode;
}
