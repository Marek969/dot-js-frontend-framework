import { h } from "@dotjs/framework";
import { TaskItem } from "./TaskItem";
import { Todo } from "../store";

interface TodoSectionProps {
  tasks: Todo[];
  onDelete: (id: number) => void;
}

export function TodoSection({ tasks }: TodoSectionProps) {
  return h(
    "ul",
    null,
    tasks.map((todo) => TaskItem({ todo }))
  );
}