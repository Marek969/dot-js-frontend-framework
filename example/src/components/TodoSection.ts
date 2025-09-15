import { h } from "@dotjs/framework";
import { TaskItem } from "./TaskItem";

export function TodoSection({ tasks, onDelete }) {
  return h(
    "ul",
    null,
    tasks.map((todo) => TaskItem({ todo, onDelete }))
  );
}