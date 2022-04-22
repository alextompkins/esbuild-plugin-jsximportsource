import { build, BuildOptions } from 'esbuild';
import fs from 'fs';

import jsxImportSourcePlugin from '../src';

const tests = ['emotion', 'noPragma', 'react'] as const;
type TestType = typeof tests[number];

const TEST_OUTPUT_FILE = './test/output.js';

const esbuildOptions: BuildOptions = {
  plugins: [jsxImportSourcePlugin()],
  outfile: TEST_OUTPUT_FILE,
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  target: 'es6',
  tsconfig: './tsconfig.json'
};

async function buildExample(type: TestType) {
  await build({
    ...esbuildOptions,
    entryPoints: [`test/examples/${type}.example.tsx`]
  });
}

const trimCarriageReturns = (str: string): string => str.replace(/\r/gm, '');

describe('esbuild-plugin-jsximportsource', () =>
  tests.forEach((test) =>
    it(`should match the expected output for '${test}'`, async () => {
      await buildExample(test);

      const actual = trimCarriageReturns(
        String(await fs.promises.readFile(TEST_OUTPUT_FILE))
      );

      const expected = trimCarriageReturns(
        String(await fs.promises.readFile(`test/expected/${test}.expected.js`))
      );

      expect(actual).toBe(expected);

      await fs.promises.unlink(TEST_OUTPUT_FILE);
    })
  ));
