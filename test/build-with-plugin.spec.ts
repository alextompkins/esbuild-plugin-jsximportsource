import { build, BuildOptions } from 'esbuild';

import jsxImportSourcePlugin from '../src';

const esbuildOptions: BuildOptions = {
  plugins: [jsxImportSourcePlugin()],
  outfile: './test/output.js',
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  target: 'es6',
  tsconfig: './tsconfig.json'
};

async function buildExample(type: 'emotion' | 'noPragma' | 'react') {
  await build({
    ...esbuildOptions,
    entryPoints: [`test/examples/${type}.example.tsx`]
  });
}

describe('esbuild-plugin-jsximportsource', () => {
  it('should replace the @jsxImportSource pragma with @jsx', async () => {
    await buildExample('emotion');
  });
});
