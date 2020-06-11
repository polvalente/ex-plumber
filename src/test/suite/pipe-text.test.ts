import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { pipeText, textRangeRegExp } from "../../lib/pipe-text";
import { samples, multiLineSamples } from "./fixtures/pipe-text";

suite("Unit tests for the pipeText function", () => {
  vscode.window.showInformationMessage("Starting unit tests for pipeText.");

  samples.forEach(({ name, before, after }) => {
    test(`Should convert to pipe with ${name}`, () => {
      const [selected] = textRangeRegExp.exec(before) as string[];
      assert(typeof selected === "string");
      const piped = pipeText(selected);
      assert.equal(piped, after);
    });
  });

  multiLineSamples.forEach(({ name, before, after }) => {
    test(`Should convert to pipe with ${name}`, () => {
      const [selected] = textRangeRegExp.exec(before) as string[];
      assert(typeof selected === "string");
      const piped = pipeText(selected);
      const expected = before.replace(textRangeRegExp, piped);
      assert.equal(expected, after);
    });
  });
});
