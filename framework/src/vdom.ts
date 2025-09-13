export type VNodeChild = string | number | boolean | VNode | VNode[] | null | undefined;
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
      result.push({ type: "text", props: { nodeValue: String(child) }, children: [] });
    } else if (child != null) {
      result.push(child as VNode);
    }
  });
  return result;
}
export function createElement(vnode: VNode): Node {
  if (typeof vnode.type === "function") {
    const rendered = vnode.type(vnode.props ?? {});
    vnode.__rendered = rendered;
    return createElement(rendered);
  }

  if (vnode.type === "text") {
    return document.createTextNode(vnode.props?.nodeValue || "");
  }

  const el = document.createElement(vnode.type);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, value as EventListener);
      } else if (key === "style" && typeof value === "object" && value !== null) {
        Object.assign((el as HTMLElement).style, value);
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
    (a && b && a.type !== b.type) ||
    (a && b && a.type === "text" && a.props?.nodeValue !== b.props?.nodeValue)
  );
}

export function updateElement(parent: Node, newVNode: VNode | null, oldVNode: VNode | null, index = 0): void {
  const existingNode = parent.childNodes[index];

  if (!oldVNode && newVNode) {
    parent.appendChild(createElement(newVNode));
  } else if (oldVNode && !newVNode) {
    if (existingNode) parent.removeChild(existingNode);
  } else if (oldVNode && newVNode && changed(oldVNode, newVNode)) {
    if (existingNode) {
      parent.replaceChild(createElement(newVNode), existingNode);
    }
  } else if (oldVNode && newVNode && typeof newVNode.type !== "function") {
    const newChildren = normalizeChildren(newVNode.children);
    const oldChildren = normalizeChildren(oldVNode.children);
    const max = Math.max(newChildren.length, oldChildren.length);
    for (let i = 0; i < max; i++) {
      updateElement(existingNode, newChildren[i], oldChildren[i], i);
    }
  }
}

export function mount(vnode: VNode, container: Node): void {
  container.appendChild(createElement(vnode));
}
