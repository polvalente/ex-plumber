// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { convertCallToPipe } from "./lib/pipe-text";
import { convertPipeToFunctionCall } from "./lib/unpipe-text";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("ExPlumber is now active!");

  const commands = [
    { name: "explumber.convertFunctionToPipe", callback: convertCallToPipe },
    {
      name: "explumber.convertPipeToFunctionCall",
      callback: convertPipeToFunctionCall,
    },
  ];

  for (const { name, callback } of commands) {
    let disposable = vscode.commands.registerCommand(name, callback);

    context.subscriptions.push(disposable);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
