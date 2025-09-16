import { h } from "@dotjs/framework";
import { useStore } from "../store";

export function Stats() {
  const { todos } = useStore();
  const completed = todos.filter((t) => t.completed).length;
  return h(
    "div",
    { className: "stats mb-4" },
    `Completed: ${completed} / Total: ${todos.length}`
  );
}