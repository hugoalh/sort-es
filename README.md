# Sort (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/sort-es](https://img.shields.io/github/v/release/hugoalh/sort-es?label=hugoalh/sort-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/sort-es")](https://github.com/hugoalh/sort-es)
[![JSR: @hugoalh/sort](https://img.shields.io/jsr/v/@hugoalh/sort?label=@hugoalh/sort&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/sort")](https://jsr.io/@hugoalh/sort)
[![NPM: @hugoalh/sort](https://img.shields.io/npm/v/@hugoalh/sort?label=@hugoalh/sort&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/sort")](https://www.npmjs.com/package/@hugoalh/sort)

An ES (JavaScript & TypeScript) module for enhanced sort operation.

## 🔰 Begin

### 🎯 Targets

|  | **Remote** | **JSR** | **NPM** |
|:--|:--|:--|:--|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ❓ | ✔️ |
| **[Cloudflare Workers](https://workers.cloudflare.com/)** | ❌ | ❓ | ✔️ |
| **[Deno](https://deno.land/)** >= v1.42.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v16.13.0 | ❌ | ❓ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/sort-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/sort[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/sort[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Runtime Permissions

*This module does not request any runtime permission.*

## 🧩 APIs

- ```ts
  function sortCollectionByKeys<V>(item: { [key: string]: V; }, options?: SortOptions<string> & SortStringsOptions): { [key: string]: V; };
  function sortCollectionByKeys<V>(item: Map<bigint, V>, options?: SortOptions<bigint>): Map<bigint, V>;
  function sortCollectionByKeys<V>(item: Map<number, V>, options?: SortOptions<number>): Map<number, V>;
  function sortCollectionByKeys<V>(item: Map<bigint | number, V>, options?: SortOptions<bigint | number>): Map<bigint | number, V>;
  function sortCollectionByKeys<V>(item: Map<string, V>, options?: SortOptions<string> & SortStringsOptions): Map<string, V>;
  function sortCollectionByKeys<V>(item: Record<string, V>, options?: SortOptions<string> & SortStringsOptions): Record<string, V>;
  ```
- ```ts
  function sortCollectionByKeysGeneric<K extends bigint | number, V>(item: Map<K, V>, options?: SortOptions<K>): Map<K, V>;
  function sortCollectionByKeysGeneric<K extends string, V>(item: Map<K, V>, options?: SortOptions<K> & SortStringsOptions): Map<K, V>;
  function sortCollectionByKeysGeneric<K extends string, V>(item: Record<K, V>, options?: SortOptions<K> & SortStringsOptions): Record<K, V>;
  ```
- ```ts
  function sortNumerics(item: readonly bigint[], options?: SortOptions<bigint>): bigint[];
  function sortNumerics(item: Set<bigint>, options?: SortOptions<bigint>): Set<bigint>;
  function sortNumerics(item: readonly number[], options?: SortOptions<number>): number[];
  function sortNumerics(item: Set<number>, options?: SortOptions<number>): Set<number>;
  function sortNumerics(item: readonly (bigint | number)[], options?: SortOptions<bigint | number>): (bigint | number)[];
  function sortNumerics(item: Set<bigint | number>, options?: SortOptions<bigint | number>): Set<bigint | number>;
  ```
- ```ts
  function sortNumericsGeneric<T extends bigint | number>(item: readonly T[], options?: SortOptions<T>): T[];
  function sortNumericsGeneric<T extends bigint | number>(item: Set<T>, options?: SortOptions<T>): Set<T>;
  ```
- ```ts
  function sortStrings(item: readonly string[], options?: SortOptions<string> & SortStringsOptions): string[];
  function sortStrings(item: Set<string>, options?: SortOptions<string> & SortStringsOptions): Set<string>;
  ```
- ```ts
  function sortStringsGeneric<T extends string>(item: readonly T[], options?: SortOptions<T> & SortStringsOptions): T[];
  function sortStringsGeneric<T extends string>(item: Set<T>, options?: SortOptions<T> & SortStringsOptions): Set<T>;
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/sort)

## ✍️ Examples

- ```ts
  sortNumerics([1.1, 1.2, 1n, 0]);
  //=> [0, 1n, 1.1, 1.2]
  ```
- ```ts
  sortStrings(["sample10.png", "sample3.png", "sample2.png", "sample5.png", "sample4.png"], { smartNumeric: true });
  //=> ["sample2.png", "sample3.png", "sample4.png", "sample5.png", "sample10.png"]
  ```
