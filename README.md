# node_deno_shims

Deno shims for Node.js

## Packages

- [@deno/shim-deno](packages/shim-deno) - Deno namespace shim.
  - [@deno/shim-deno-test](packages/shim-deno-test) - `Deno.test` only shim.
- [@deno/shim-crypto](packages/shim-crypto) - Shim for the `crypto` global.
- [@deno/shim-prompts](packages/shim-prompts) - Shims for `alert`, `confirm` and
  `prompt`.
- [@deno/shim-timers](packages/shim-timers) - Shims for `setTimeout` and
  `setInterval`.
- [@deno/sham-weakref](packages/sham-weakref) - Sham for the `WeakRef` global
  that uses the global `WeakRef` if it exists.

## Contributing

Commands:

```sh
# get submodules it you did not clone them initially
git submodule init
git submodule update
# upgrade or downgrade your deno binary to match deno source in packages/shim-deno/third_party/deno
deno upgrade --version 1.28.1
# npm install
npm i --ignore-scripts
# build all packages
npm run build --workspaces
# test all packages
npm run test --workspaces
# format
deno fmt
# lint
deno lint
```

For package specific development commands, see the package.json scripts in each
package.
