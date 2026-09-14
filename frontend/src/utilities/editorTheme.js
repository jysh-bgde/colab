import { EditorView } from "codemirror";
const editorTheme = EditorView.theme(
    {
      "&": {
        color: "white",
        backgroundColor: "black",
      },
      ".cm-content": {
        caretColor: "#0e9",
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0e9",
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#074",
      },
      ".cm-gutters": {
        backgroundColor: "rgb(30, 30, 30)",
        color: "#ddd",
        border: "none",
      },
    },
    { dark: true },
  );

export default editorTheme