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

const handleSelection = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): toPipeResults | undefined => {
  const currentDoc = editor?.document;
  //   const text = currentDoc.getText();
  const position = selection.active;
  const functionCallRange = currentDoc.getWordRangeAtPosition(
    position,
    /\w+\([^\(\)]*/
  );
  const functionCallText = currentDoc.getText(functionCallRange);
  if (!functionCallRange) return;

  console.log("functionCallRange", functionCallRange);
  console.log("functionCallText", `>>${functionCallText}`);

  const splitAtParen = functionCallText.split("(");
  const functionName = splitAtParen[0];
  const args = splitAtParen[1].split(",");

  const firstArg = args[0];
  const otherArgsList = args.slice(1);
  const otherArgs = otherArgsList ? otherArgsList.join(",") : "";

  const pipedText = `${firstArg} |> ${functionName}(${otherArgs.trimLeft()}`;

  console.log("piped", `>>${pipedText}<<`);

  return { pipedText, functionCallRange };
};

// test text
// asdafsa name(arg1, arg2) asdsahdjksh
// asdasf arg1 |> name(arg2)

// asdafsa name(arg1) asdsahdjksh
// asdasf arg1 |> name()
