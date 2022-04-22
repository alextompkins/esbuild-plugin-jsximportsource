import { Plugin } from 'esbuild';
import fs from 'fs';

export interface Options {
  filter?: RegExp;
}

export interface ImportSourceResult {
  pragmaStart: number;
  pragmaEnd: number;
  importFrom: string;
}

const DEFAULT_FILTER = /.(jsx|tsx)/;

const JSXIMPORT_SOURCE_PRAGMA_PATTERN =
  /\/\*\* @jsxImportSource ([\w@/]+) \*\//;

const containsJsxImportSourcePragma = (
  contents: string
): ImportSourceResult | null => {
  const match = JSXIMPORT_SOURCE_PRAGMA_PATTERN.exec(contents);

  if (!match) return null;

  return {
    pragmaStart: match.index,
    pragmaEnd: 0,
    importFrom: match[0]
  };
};

const generateJsxPragmaFor = (importFrom: string) =>
  `/** @jsx jsx */
import { jsx } from ${importFrom}`;

const convertPragma = (
  input: string,
  { pragmaStart, pragmaEnd, importFrom }: ImportSourceResult
): string => {
  return (
    input.slice(0, pragmaStart) +
    generateJsxPragmaFor(importFrom) +
    input.slice(pragmaEnd)
  );
};

const createPlugin = (
  { filter = DEFAULT_FILTER }: Options = { filter: DEFAULT_FILTER }
): Plugin => ({
  name: 'jsximportsource',
  setup: (build) => {
    build.onLoad({ filter }, async (args) => {
      const input = String(await fs.promises.readFile(args.path));

      const jsxImportSourceResult = containsJsxImportSourcePragma(input);

      const output = jsxImportSourceResult
        ? convertPragma(input, jsxImportSourceResult)
        : input;

      return {
        output,
        loader: 'jsx'
      };
    });
  }
});

export default createPlugin;
