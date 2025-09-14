import { h } from "@dotjs/framework";
import { TaskItem } from "./TaskItem";
import { Todo } from "../store";

export function TodoSection({ todos }: { todos: Todo[] }) {
  return h(
    "ul",
    { className: "todo-list" },
    todos.map((todo) => TaskItem({ todo }))
  );
}