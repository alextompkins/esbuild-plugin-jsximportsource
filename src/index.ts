import { Plugin } from 'esbuild';
import fs from 'fs';

export interface Options {
  filter?: RegExp;
}

interface ImportSourceResult {
  pragmaStart: number;
  pragmaEnd: number;
  importFrom: string;
}

const DEFAULT_FILTER = /.(jsx|tsx)/;

const JSXIMPORT_SOURCE_PRAGMA_PATTERN =
  /\/\*\* @jsxImportSource (?<importSource>[\w@/]+) \*\//;

const containsJsxImportSourcePragma = (
  contents: string
): ImportSourceResult | null => {
  const match = JSXIMPORT_SOURCE_PRAGMA_PATTERN.exec(contents);

  if (!match || !match.groups) return null;

  return {
    pragmaStart: match.index,
    pragmaEnd: match.index + match[0].length,
    importFrom: match.groups.importSource
  };
};

const generateJsxPragmaFor = (importFrom: string) =>
  `/** @jsx jsx */
import { jsx } from '${importFrom}'`;

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
        contents: output,
        loader: 'jsx'
      };
    });
  }
});

export { createPlugin as jsxImportSourcePlugin };
