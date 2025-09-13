export type Primitive = string | number | boolean | null | undefined;

export type Props = {
  [key: string]: any;
  key?: string | number;
  style?: Partial<CSSStyleDeclaration>;
  class?: string;
  className?: string;
  bind?: string | string[];
};

export interface VNode {
  type: string | ComponentFn | 'fragment';
  props?: Props;
  children?: Array<VNode | Primitive | Array<VNode | Primitive> | null | undefined>;
  __rendered?: VNode | Primitive | null;
}

export type ComponentFn = (props?: Props, ctx?: any) => VNode | Primitive | Array<VNode | Primitive> | null;

export type StoreAPI<S> = {
  getState(): S;
  setState(updater: ((s: S) => S) | Partial<S>): void;
  subscribe(fn: (s: S) => void): () => void;
};
