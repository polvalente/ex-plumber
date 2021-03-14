import * as vscode from "vscode";
import { execSync } from "child_process";
import { promisify } from "util";

type toPipeResults = {
  pipedText: string;
  functionCallRange: vscode.Range;
};

export const convertCallToPipe = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) return;

  const handledSelections = editor.selections
    .map((selection) => handleSelection(editor, selection))
    .filter((selection) => selection);

  if (!handledSelections) return;

  editor?.edit((edit) => {
    for (const {
      pipedText,
      functionCallRange,
    } of handledSelections as toPipeResults[]) {
      edit.replace(functionCallRange as vscode.Range, pipedText);
    }
  });
};

export const pipeText = (text: string) => {
  return execSync(
    `./src/elixir_src/ex_plumber_escript/ex_plumber_escript --direction to_pipe --length ${text.length}`,
    {
      input: text,
    }
  )
    .toString()
    .trim();
};

export const textRangeRegExp = /(\w+\.)*\w+\.?\([^\)]*/m;

const handleSingleLine = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): toPipeResults | undefined => {
  const currentDoc = editor?.document;
  const position = selection.active;
  const functionCallRange = currentDoc.getWordRangeAtPosition(
    position,
    textRangeRegExp
  );
  const functionCallText = currentDoc.getText(functionCallRange);
  if (!functionCallRange) return;

  const pipedText = pipeText(functionCallText);

  return { pipedText, functionCallRange };
};

const handleMultiLine = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): toPipeResults | undefined => {
  const original = editor.document.getText(selection);
  const [extracted] = textRangeRegExp.exec(original) as string[];
  if (typeof extracted !== "string") return undefined;
  const formatted = pipeText(extracted);

  const pipedText = original.replace(textRangeRegExp, formatted);

  return { pipedText, functionCallRange: selection };
};

const handleSelection = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): toPipeResults | undefined => {
  return selection.isSingleLine
    ? handleSingleLine(editor, selection)
    : handleMultiLine(editor, selection);
};
