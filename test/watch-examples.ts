import { build, BuildOptions } from 'esbuild';

import { jsxImportSourcePlugin } from '../src';

const esbuildOptions: BuildOptions = {
  bundle: true,
  outdir: 'test/output',
  plugins: [jsxImportSourcePlugin()],
  tsconfig: './tsconfig.json',
  watch: {
    onRebuild: (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log('Rebuilt successfully.');
      }
    }
  }
};

build({
  ...esbuildOptions,
  entryPoints: ['test/examples/index.tsx']
})
  .then(() => console.log('Esbuild is watching...'))
  .catch((err) => console.error(err));
