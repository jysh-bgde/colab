import { EditorView, basicSetup } from "codemirror";
import { drawSelection, highlightActiveLine } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
  HighlightStyle,
  syntaxHighlighting,
} from "@codemirror/language";
import { history } from "@codemirror/commands";
import { closeBrackets, autocompletion } from "@codemirror/autocomplete";
import { highlightSelectionMatches } from "@codemirror/search";
import editorTheme from "./editorTheme";
import { Annotation } from "@codemirror/state";
import ACTIONS from "../actions.js";
import { tags } from "@lezer/highlight";

const External = Annotation.define();

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "red" },
  { tag: tags.comment, color: "yellow", fontStyle: "italic" },
  {tag: tags.brace, color: "#00FFFF"},
  {tag: tags.bracket, color: "#00FA9A"}
]);

const updateListenerFunction = (codeRef, socketRef, roomId) => {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      const isRemote = update.transactions.some((tr) =>
        tr.annotation(External),
      );
      if (isRemote) return;

      const code = update.state.doc.toString();
      codeRef.current = code;

      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }
  });
  return updateListener;
};

export function createEditorView(parentElement, updateListener, option = {}) {
  const myTheme = editorTheme;
  const editorView = new EditorView({
    doc: 'console.log("hello")',
    extensions: [
      basicSetup,
      javascript(),
      bracketMatching(),
      foldGutter(),
      history(),
      drawSelection(),
      indentOnInput(),
      closeBrackets(),
      autocompletion(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      syntaxHighlighting(myHighlightStyle),
      myTheme,
      updateListener,
      EditorView.lineWrapping,
    ],
    parent: parentElement,
  });

  return editorView;
}

export default updateListenerFunction;

export function applyRemoteCode(view, code) {
  if (!view || code == null) return;
  const currentCode = view.state.doc.toString();
  if (currentCode === code) return;

  view.dispatch({
    changes: { from: 0, to: currentCode.length, insert: code },
    annotations: [External.of(true)],
  });
}
