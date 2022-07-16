import { build, BuildOptions } from 'esbuild';
import * as fs from 'node:fs';

import { jsxImportSourcePlugin } from '../src';

const tests = ['emotion', 'noPragma', 'react'] as const;
type TestType = typeof tests[number];

const OUT_DIR = 'test/output';

const esbuildOptions: BuildOptions = {
  plugins: [jsxImportSourcePlugin()],
  tsconfig: './tsconfig.json'
};

async function buildExample(type: TestType) {
  await build({
    ...esbuildOptions,
    entryPoints: [`test/examples/${type}.example.tsx`],
    outfile: `${OUT_DIR}/${type}.example.js`
  });
}

const trimCarriageReturns = (str: string): string => str.replace(/\r/gm, '');

describe('esbuild-plugin-jsximportsource', () =>
  tests.forEach((test) =>
    it(`should match the expected output for '${test}'`, async () => {
      await buildExample(test);

      const actual = trimCarriageReturns(
        String(await fs.promises.readFile(`${OUT_DIR}/${test}.example.js`))
      );

      const expected = trimCarriageReturns(
        String(await fs.promises.readFile(`test/expected/${test}.expected.js`))
      );

      expect(actual).toBe(expected);
    })
  ));
