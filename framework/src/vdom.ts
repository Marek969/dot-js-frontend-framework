import {
  addDelegatedEvent,
  removeDelegatedEvent,
  NON_BUBBLING,
} from "./events";

export type VNodeChild =
  | string
  | number
  | boolean
  | VNode
  | VNode[]
  | null
  | undefined;
export type Component<P = Record<string, any>> = (props: P) => VNode;

export interface VNode {
  type: string | Component<any>;
  props: Record<string, any> | null;
  children: VNodeChild[];
  __rendered?: VNode | null;
}
export function h(
  type: VNode["type"],
  props: Record<string, any> | null = null,
  ...children: VNodeChild[]
): VNode {
  return {
    type,
    props,
    children,
  };
}
function normalizeChildren(children: VNodeChild[]): VNode[] {
  const result: VNode[] = [];
  children.forEach((child) => {
    if (Array.isArray(child)) {
      result.push(...normalizeChildren(child));
    } else if (
      typeof child === "string" ||
      typeof child === "number" ||
      typeof child === "boolean"
    ) {
      result.push({
        type: "text",
        props: { nodeValue: String(child) },
        children: [],
      });
    } else if (child != null) {
      result.push(child as VNode);
    }
  });
  return result;
}
function renderVNode(v: VNode): VNode {
  let current: VNode = v;
  while (typeof current.type === "function") {
    const rendered = (current.type as any)(current.props ?? {});
    current.__rendered = rendered;
    current = rendered;
  }
  return current;
}
export function createElement(vnode: VNode): Node {
  vnode = renderVNode(vnode);

  if (vnode.type === "text") {
    return document.createTextNode(vnode.props?.nodeValue || "");
  }

  const el = document.createElement(vnode.type as string);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        const event = key.slice(2).toLowerCase();
        if (NON_BUBBLING.has(event)) {
          (el as any).__directListeners = (el as any).__directListeners || {};
          (el as any).__directListeners[event] = value as EventListener;
          el.addEventListener(event, value);
        } else {
          (el as any).__listeners = (el as any).__listeners || {};
          (el as any).__listeners[event] = value as EventListener;
          addDelegatedEvent(event);
        }
      } else if (
        key === "style" &&
        typeof value === "object" &&
        value !== null
      ) {
        Object.assign((el as HTMLElement).style, value);
      } else if (key === "className") {
        (el as any).className = String(value ?? "");
      } else if (
        key === "value" &&
        (el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          el instanceof HTMLSelectElement)
      ) {
        (el as any).value = value ?? "";
      } else if (key === "checked" && el instanceof HTMLInputElement) {
        (el as any).checked = Boolean(value);
      } else if (value === true) {
        (el as any)[key] = true;
      } else if (value === false || value == null) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }

  const normalized = normalizeChildren(vnode.children);
  for (const child of normalized) {
    el.appendChild(createElement(child));
  }

  return el;
}
function changed(a: VNode | null, b: VNode | null): boolean {
  return (
    typeof a !== typeof b ||
    (a && b && (typeof a.type === "function" || typeof b.type === "function") && (renderVNode(a).type !== renderVNode(b).type)) ||
    (a && b && a.type !== b.type) ||
    (a && b && renderVNode(a).type === "text" && renderVNode(a).props?.nodeValue !== renderVNode(b).props?.nodeValue)
  );
}

function applyProps(el: Element, newProps: Record<string, any> | null, oldProps: Record<string, any> | null) {
  const n = newProps || {};
  const o = oldProps || {};

  // Remove old
  for (const key of Object.keys(o)) {
    if (!(key in n)) {
      if (key.startsWith("on")) {
        const event = key.slice(2).toLowerCase();
        if (NON_BUBBLING.has(event)) {
          const prev = (el as any).__directListeners?.[event];
          if (prev) {
            el.removeEventListener(event, prev);
            delete (el as any).__directListeners[event];
          }
        } else {
          if ((el as any).__listeners?.[event]) {
            delete (el as any).__listeners[event];
            removeDelegatedEvent(event);
          }
        }
      } else if (key === "className") {
        (el as any).className = "";
      } else if (key === "style") {
        (el as HTMLElement).removeAttribute("style");
      } else if (key === "value") {
        (el as any).value = "";
      } else if (key === "checked") {
        (el as any).checked = false;
      } else {
        (el as any).removeAttribute(key);
      }
    }
  }

  // Add/update new
  for (const [key, value] of Object.entries(n)) {
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      if (NON_BUBBLING.has(event)) {
        (el as any).__directListeners = (el as any).__directListeners || {};
        const prev = (el as any).__directListeners[event];
        if (prev) el.removeEventListener(event, prev);
        (el as any).__directListeners[event] = value as EventListener;
        el.addEventListener(event, value);
      } else {
        const hadOld = o && !!o[key];
        (el as any).__listeners = (el as any).__listeners || {};
        (el as any).__listeners[event] = value as EventListener;
        if (!hadOld) addDelegatedEvent(event);
      }
    } else if (key === "style" && typeof value === "object" && value !== null) {
      Object.assign((el as HTMLElement).style, value);
    } else if (key === "className") {
      (el as any).className = String(value ?? "");
    } else if (key === "value" && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) {
      (el as any).value = value ?? "";
    } else if (key === "checked" && el instanceof HTMLInputElement) {
      (el as any).checked = Boolean(value);
    } else if (value === true) {
      (el as any)[key] = true;
    } else if (value === false || value == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, String(value));
    }
  }
}

export function updateElement(parent: Node, newVNode: VNode | null, oldVNode: VNode | null, index = 0): void {
  const existingNode = parent.childNodes[index] as Element | undefined;

  if (newVNode) newVNode = renderVNode(newVNode);
  if (oldVNode) oldVNode = renderVNode(oldVNode);

  if (!oldVNode && newVNode) {
    parent.appendChild(createElement(newVNode));
  } else if (oldVNode && !newVNode) {
    if (existingNode) parent.removeChild(existingNode);
  } else if (oldVNode && newVNode && changed(oldVNode, newVNode)) {
    if (existingNode) {
      parent.replaceChild(createElement(newVNode), existingNode);
    }
  } else if (oldVNode && newVNode) {
    // Same element type; update props and children
    if (existingNode && newVNode.type !== "text") {
      applyProps(existingNode as Element, newVNode.props || null, oldVNode.props || null);
    }

    const newChildren = normalizeChildren(newVNode.children);
    const oldChildren = normalizeChildren(oldVNode.children);
    const max = Math.max(newChildren.length, oldChildren.length);
    for (let i = 0; i < max; i++) {
      updateElement(existingNode as Node, newChildren[i], oldChildren[i], i);
    }
  }
}

export function mount(vnode: VNode, container: Node): void {
  container.appendChild(createElement(renderVNode(vnode)));
}
