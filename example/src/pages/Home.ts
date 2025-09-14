import { h } from "@dotjs/framework";
import { Stats } from "../components/Stats";
import { TodoSection } from "../components/TodoSection";
import { addTodo, loadSampleData, useStore } from "../store";
import store from "../store";

export function Home() {
  const { todos, newTodo } = useStore();

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    store.setState((s) => ({
      ...s,
      newTodo: value,
    }));
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    addTodo();
    return false;
  }

  return h("div", { className: "p-6" }, [
    h("h2", { className: "text-xl font-semibold mb-4" }, "Todo List"),
    Stats(),
    h("form", { onSubmit: handleSubmit }, [
      h("input", {
        type: "text",
        placeholder: "Add a task...",
        value: newTodo,
        onInput: handleInput,
        className: "todo-input",
      }),
      h("button", { type: "submit", className: "button-primary" }, "Add"),
      h("button", { type: "button", onClick: loadSampleData, className: "button-secondary" }, "Load Sample"),
    ]),
    TodoSection({ todos }),
    h("div", null, [
      h("a", { href: "#/" }, "All"),
      h("span", null, " | "),
      h("a", { href: "#/virtual" }, "Virtual List"),
    ]),
  ]);
}