import { h } from "@dotjs/framework";
import { useStore, addTodo } from "../store";
import { TaskItem } from "../components/TaskItem";

let inputValue = "";

export function Todo({ filter }: { filter?: string }) {
  const { todos } = useStore();

  function handleInput(e: Event) {
    inputValue = (e.target as HTMLInputElement).value;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue);
      inputValue = "";
      const input = document.querySelector(".todo-input") as HTMLInputElement;
      if (input) input.value = "";
    }
  }

  const normalized = (filter || "").toLowerCase();
  const filtered = todos.filter((t) => {
    if (normalized === "active") return !t.completed;
    if (normalized === "completed") return t.completed;
    return true;
  });

  return h("div", { className: "main-container" }, [
    h("h2", {}, "Todo List"),
    h(
      "div",
      { style: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem" } },
      [
        h("a", { href: "#/todo", className: "nav-link" + (normalized === "" ? " active" : "") }, "All"),
        h(
          "a",
          { href: "#/todo/active", className: "nav-link" + (normalized === "active" ? " active" : "") },
          "Active"
        ),
        h(
          "a",
          { href: "#/todo/completed", className: "nav-link" + (normalized === "completed" ? " active" : "") },
          "Completed"
        ),
      ]
    ),
    h("form", { onSubmit: handleSubmit }, [
      h("input", {
        type: "text",
        placeholder: "Add a task...",
        onInput: handleInput,
        className: "todo-input",
        value: inputValue,
      }),
      h("button", {
        type: "submit",
        className: "button-primary",
      }, "Add"),
    ]),
    h(
      "ul",
      { className: "todo-list" },
      filtered.map((todo) => TaskItem({ todo }))
    ),
  ]);
}
