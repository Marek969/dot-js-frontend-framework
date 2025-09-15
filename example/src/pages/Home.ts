import { h } from "@dotjs/framework";

export function Home() {
  return h("div", { className: "main-container" }, [
    h("section", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }
    }, [
      h("h1", { style: { margin: 0 } }, "Dot‑JS Playground"),
      h(
        "p",
        { style: { margin: 0, color: "#64748b" } },
        "A tiny framework with virtual DOM, store, router and delegated events."
      ),
      h("div", { style: { display: "flex", gap: "0.5rem", marginTop: "0.25rem" } }, [
        h(
          "a",
          { href: "#/todo", className: "button-primary", style: { textDecoration: "none" } },
          "Open Todo"
        ),
        h(
          "a",
          { href: "#/notes", className: "button-secondary", style: { textDecoration: "none" } },
          "Open Notes"
        ),
      ]),
    ]),

    h(
      "section",
      {
        style: {
          marginTop: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.75rem",
        },
      },
      [
        card("⚡ Rendering", "Light virtual DOM with diff and prop updates."),
        card("🧠 State", "Global store, subscriptions and localStorage persistence."),
        card("🧭 Routing", "Hash routing with reactive subscriptions."),
      ]
    ),
  ]);
}

function card(title: string, desc: string) {
  return h(
    "div",
    {
      style: {
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "1rem",
        background: "#ffffff",
      },
    },
    [
      h("h3", { style: { margin: "0 0 0.25rem 0" } }, title),
      h("p", { style: { margin: 0, color: "#64748b" } }, desc),
    ]
  );
}