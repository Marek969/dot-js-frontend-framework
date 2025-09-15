import { h } from "@dotjs/framework";
import { toggleTodo, deleteTodo, Todo } from "../store";

export function TaskItem({ todo }: { todo: Todo }) {
  return h(
    "li",
    {
      className: "todo-item",
      style: { textDecoration: todo.completed ? "line-through" : "none" },
    },
    [
      h(
        "span",
        { onClick: () => toggleTodo(todo.id), style: { cursor: "pointer" } },
        todo.text
      ),
      h(
        "button",
        {
          onClick: () => deleteTodo(todo.id),
          className: "button-delete",
          style: { marginLeft: "1rem", background: "#dc3545", border: "none" },
        },
        h("img", {
          src: "/icons/delete.svg",
          alt: "Delete",
          className: "delete-icon",
        })
      ),
    ]
  );
}