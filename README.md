# esbuild-plugin-jsximportsource

[![test](https://github.com/alextompkins/esbuild-plugin-jsximportsource/actions/workflows/test.yml/badge.svg)](https://github.com/alextompkins/esbuild-plugin-jsximportsource/actions/workflows/test.yml)

An esbuild plugin to support the `@jsxImportSource` pragma.

**OBSOLETE**: I am retiring this plugin because [support for the automatic JSX runtime has landed in esbuild as of v0.14.51](https://github.com/evanw/esbuild/releases/tag/v0.14.51). 

**BREAKING CHANGE**: v1 of this plugin exports only an ESM entrypoint. 
This means it will only work using `import` syntax. 
If you need to use this plugin from a CJS build script, you have two options:
1. Use a [dynamic import](https://nodejs.org/api/esm.html#import-expressions), which is supported by Node 12+.
2. Use v0, which exports a CJS entrypoint that you can `require()`. 

## Install
```
npm i esbuild-plugin-jsximportsource
```

## Usage
Just add it to your esbuild plugins:

```js
import { jsxImportSourcePlugin } from 'esbuild-plugin-jsximportsource';

await esbuild.build({
  ...
  plugins: [jsxImportSourcePlugin()]
});
```

This will replace `@jsxImportSource` with an import from the specified package and the `@jsx` pragma, which [esbuild supports natively](https://github.com/evanw/esbuild/issues/138). 

By default, this will only transform `.jsx` or `.tsx` files. You can change this by specifying a custom filter:
```js
await esbuild.build({
  ...
  plugins: [jsxImportSourcePlugin({ filter: /.(js|ts|jsx|tsx)/ })]
});
```

## Example
```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const Component = () => (
  <div
    css={css`
      background-color: hotpink;
    `}
  >
    Hello!
  </div>
);

```
becomes:
```tsx
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { css } from '@emotion/react';

export const Component = () => (
  <div
    css={css`
      background-color: hotpink;
    `}
  >
    Hello!
  </div>
);
```

which gets transpiled to:
```js
import { jsx } from "@emotion/react";
import { css } from "@emotion/react";
export const Component = () => /* @__PURE__ */ jsx("div", {
  css: css`
      background-color: hotpink;
    `
}, "Hello!");

```
