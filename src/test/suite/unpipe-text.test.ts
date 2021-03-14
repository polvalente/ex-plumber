import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { unpipeText, textRangeRegExp } from "../../lib/unpipe-text";
import { samples, multiLineSamples } from "./fixtures/unpipe-text";

suite("Unit tests for the pipeText function", () => {
  vscode.window.showInformationMessage("Starting unit tests for pipeText.");

  samples.forEach(({ name, piped, unpiped }) => {
    test(`single-line Should convert from pipe with ${name}`, () => {
      const result = unpipeText(piped);
      assert.equal(result, unpiped);
    });
  });

  multiLineSamples.forEach(({ name, piped, unpiped }) => {
    test(`multi-line Should convert from pipe with ${name}`, () => {
      const [selected] = textRangeRegExp.exec(piped) as string[];
      assert(typeof selected === "string");
      const processed = unpipeText(selected);
      const expected = piped.replace(textRangeRegExp, processed);
      assert.equal(expected, unpiped);
    });
  });
});
