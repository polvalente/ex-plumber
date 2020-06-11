import * as vscode from "vscode";

type fromPipeResults = {
  unpipedText: string;
  functionCallRange: vscode.Range;
};

export const convertPipeToFunctionCall = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) return;

  const handledSelections = editor.selections
    .map((selection) => handleSelection(editor, selection))
    .filter((selection) => selection);

  if (!handledSelections) return;

  editor?.edit((edit) => {
    for (const {
      unpipedText,
      functionCallRange,
    } of handledSelections as fromPipeResults[]) {
      edit.replace(functionCallRange as vscode.Range, unpipedText);
    }
  });
};

export const textRangeRegExp = /(\S+)\s*\|>\s*([^\(]+)\(([^\)]*)/m;

export const unpipeText = (text: string) => {
  const result = textRangeRegExp.exec(text);
  if (!result) return text;
  console.log(result);

  const [_, left, functionName, afterParen] = result;

  console.log("left", left);
  console.log("functionName", functionName);
  console.log("afterParen", afterParen);

  const formattedArgs = afterParen ? `${left}, ${afterParen}` : left;

  return `${functionName}(${formattedArgs}`;
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
  const functionCallText = currentDoc.getText(functionCallRange);
  if (!functionCallRange) return undefined;

  const unpipedText = unpipeText(functionCallText);

  return { unpipedText, functionCallRange };
};

const handleMultiLine = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): fromPipeResults | undefined => {
  console.log(selection);

  const original = editor.document.getText(selection);
  const [extracted] = textRangeRegExp.exec(original) as string[];
  if (typeof extracted !== "string") return undefined;
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
