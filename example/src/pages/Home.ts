import { h } from "@dotjs/framework";
import { Stats } from "../components/Stats";
import { TodoSection } from "../components/TodoSection";
import { addTodo, loadSampleData, useStore } from "../store";
import store from "../store";

export function Home() {
  const { todos, newTodo } = useStore();
  let currentInput = "";

  function handleInput(e: Event) {
    currentInput = (e.target as HTMLInputElement).value;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    store.setState((s) => ({
      ...s,
      todos: s.todos.concat({ id: Date.now(), text: currentInput.trim(), completed: false }),
    }));
    const input = document.querySelector(".todo-input") as HTMLInputElement;
    if (input) input.value = "";
    currentInput = "";
    return false;
  }

  return h("div", { className: "p-6" }, [
    h("h2", { className: "text-xl font-semibold mb-4" }, "Todo List"),
    Stats(),
    h("form", { onSubmit: handleSubmit }, [
      h("input", {
        type: "text",
        placeholder: "Add a task...",
        onInput: handleInput,
        className: "todo-input",
      }),
      h("button", { type: "submit", className: "button-primary" }, "Add"),
      h("button", { type: "button", onClick: loadSampleData, className: "button-secondary" }, "Load Sample"),
    ]),
    TodoSection({ todos }),
    h("div", { style: { marginTop: "1rem", textAlign: "center" } }, [
      h("a", { href: "#/", className: "nav-link" }, "All"),
      h("a", { href: "#/virtual", className: "nav-link" }, "Virtual List"),
    ]),
  ]);
}