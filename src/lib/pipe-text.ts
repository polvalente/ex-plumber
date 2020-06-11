import * as vscode from "vscode";

type toPipeResults = {
  pipedText: string;
  functionCallRange: vscode.Range;
};

export const convertCallToPipe = () => {
  console.log("Called explumber to pipe");
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
  const splitAtParen = text.split("(");
  const functionName = splitAtParen[0].trim();
  const args = splitAtParen[1].split(",");
  const indentation = /\s*/.exec(text);

  const firstArg = args[0].trim();
  const otherArgsList = args.slice(1);
  const otherArgs = otherArgsList ? otherArgsList.join(",") : "";

  return `${indentation}${firstArg} |> ${functionName}(${otherArgs.trimLeft()}`;
};

export const textRangeRegExp = /\w+\.?\([^\(\)]*/m;

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
  console.log(selection);

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
