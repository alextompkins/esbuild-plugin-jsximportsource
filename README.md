# esbuild-plugin-jsximportsource
An esbuild plugin to support use of the `@jsxImportSource` pragma.

This plugin will replace `@jsxImportSource` with an import from the specified package and the `@jsx` pragma, which esbuild supports natively. 
