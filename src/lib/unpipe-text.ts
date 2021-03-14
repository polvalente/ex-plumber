import * as vscode from "vscode";
import { execSync } from "child_process";

type fromPipeResults = {
  unpipedText: string;
  functionCallRange: vscode.Range;
};

export const convertPipeToFunctionCall = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const handledSelections = editor.selections
    .map((selection) => handleSelection(editor, selection))
    .filter((selection) => selection);

  if (!handledSelections) {
    return;
  }

  editor?.edit((edit) => {
    for (const {
      unpipedText,
      functionCallRange,
    } of handledSelections as fromPipeResults[]) {
      edit.replace(functionCallRange as vscode.Range, unpipedText);
    }
  });
};

export const textRangeRegExp = /([^\s;]+)\s*\|>\s*([^\(]+)\(([^\)]*)/m;

export const unpipeText = (text: string) => {
  return execSync(
    `./src/elixir_src/ex_plumber_escript/ex_plumber_escript --direction from_pipe --length ${text.length}`,
    {
      input: text,
    }
  )
    .toString()
    .trim();
};

const handleSingleLine = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): fromPipeResults | undefined => {
  const currentDoc = editor?.document;
  const position = selection.active;
  const functionCallRange = currentDoc.getWordRangeAtPosition(
    position,
    textRangeRegExp
  );

  const original = currentDoc.getText(functionCallRange);
  if (!functionCallRange) {
    return undefined;
  }

  const unpipedText = unpipeText(original);

  return { unpipedText, functionCallRange };
};

const handleMultiLine = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): fromPipeResults | undefined => {
  const original = editor.document.getText(selection);
  const [extracted] = textRangeRegExp.exec(original) as string[];
  if (typeof extracted !== "string") {
    return undefined;
  }
  const formatted = unpipeText(extracted);

  const unpipedText = original.replace(textRangeRegExp, formatted);

  return { unpipedText, functionCallRange: selection };
};

const handleSelection = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): fromPipeResults | undefined => {
  return selection.isSingleLine
    ? handleSingleLine(editor, selection)
    : handleMultiLine(editor, selection);
};
