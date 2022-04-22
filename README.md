# esbuild-plugin-jsximportsource
An esbuild plugin to support the `@jsxImportSource` pragma.

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
