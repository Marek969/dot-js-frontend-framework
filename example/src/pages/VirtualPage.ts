import { h } from "@dotjs/framework";
import { VirtualList } from "../components/VirtualList";

export function VirtualPage() {
  return h("div", { className: "p-6" }, [
    h("h2", {}, "Virtualized List Demo"),
    VirtualList(),
  ]);
}