import { h } from "@dotjs/framework";
import store, { useStore, addNote, deleteNote, updateNote } from "../store";

export function Notes() {
  const { notes, editingId = null, draftValue = "" } = useStore();

  function handleInput(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value;
    store.setState((s) => ({ ...s, draftValue: value }));
  }

  function handleSubmitNew(e: Event) {
    e.preventDefault();
    if (draftValue.trim()) {
      addNote(draftValue);
      store.setState((s) => ({ ...s, draftValue: "" }));
    }
  }

  function startEdit(note: any) {
    store.setState((s) => ({ ...s, editingId: note.id, draftValue: note.text }));
    setTimeout(() => {
      const textarea = document.querySelector(".note-input-edit") as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }, 0);
  }

  function handleSave(noteId: number) {
    if (draftValue.trim()) {
      updateNote(noteId, draftValue);
      store.setState((s) => ({ ...s, editingId: null, draftValue: "" }));
    }
  }

  function handleCancelEdit() {
    store.setState((s) => ({ ...s, editingId: null, draftValue: "" }));
  }

  return h("div", { className: "main-container" }, [
    h("h2", {}, "Notes"),
    h("form", { onSubmit: handleSubmitNew }, [
      h("textarea", {
        placeholder: "Write a note...",
        onInput: handleInput,
        className: "note-input note-input-new",
        value: editingId === null ? draftValue : "",
        disabled: editingId !== null,
      }),
      h("button", {
        type: "submit",
        className: "button-primary",
        disabled: editingId !== null,
      }, "Save Note"),
    ]),
    h(
      "ul",
      { className: "notes-list" },
      notes.map((note) =>
        editingId === note.id
          ? h("li", { className: "note-item" }, [
              h("textarea", {
                value: draftValue,
                onInput: handleInput,
                className: "note-input note-input-edit",
              }),
              h("div", {}, [
                h("button", { className: "button-primary", onClick: () => handleSave(note.id) }, "Save"),
                h("button", { className: "button-secondary", onClick: handleCancelEdit, style: { marginLeft: "0.5rem" } }, "Cancel"),
              ]),
              h("button", {
                className: "button-delete",
                onClick: () => deleteNote(note.id),
                style: { marginLeft: "1rem", background: "transparent", border: "none" },
              }, [
                h("img", { src: "/icons/delete.svg", alt: "Delete", className: "delete-icon" })
              ]),
            ])
          : h("li", { className: "note-item" }, [
              h("span", {}, note.text),
              h("button", { className: "button-secondary", onClick: () => startEdit(note) }, "Edit"),
              h("button", {
                className: "button-delete",
                onClick: () => deleteNote(note.id),
                style: { marginLeft: "1rem", background: "transparent", border: "none" },
              }, [
                h("img", { src: "/icons/delete.svg", alt: "Delete", className: "delete-icon" })
              ]),
            ])
      )
    ),
  ]);
}
